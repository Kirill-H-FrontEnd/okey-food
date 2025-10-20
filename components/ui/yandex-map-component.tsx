"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import {
  Maximize2,
  Minus,
  Plus,
  LocateFixed,
  Map as MapIcon,
  SatelliteDish,
} from "lucide-react";
import osmtogeojson from "osmtogeojson";
import * as pc from "polygon-clipping";

type LL = [number, number];
type RingLL = LL[];
type PolyLL = RingLL[];
type MultiPolyLL = PolyLL[];

const BTN =
  "w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary";

const EPS = 1e-6;
const samePt = (a: LL, b: LL) =>
  Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
const ensureClosed = (ring: RingLL): RingLL => {
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (samePt(first, last)) return ring;
  return [...ring, first];
};
const toYandexRing = (ringLonLat: number[][]): RingLL =>
  ensureClosed(ringLonLat.map(([lon, lat]) => [lat, lon] as LL));

const toLonLatRing = (ringLatLon: RingLL): number[][] =>
  ringLatLon.map(([lat, lon]) => [lon, lat]);

function normalizePC(mp: any): number[][][][] {
  if (!mp) return [];

  const looksLikePolygon =
    Array.isArray(mp) &&
    Array.isArray(mp[0]) &&
    Array.isArray(mp[0][0]) &&
    typeof mp[0][0][0] === "number";

  const looksLikeMulti =
    Array.isArray(mp) &&
    Array.isArray(mp[0]) &&
    Array.isArray(mp[0][0]) &&
    Array.isArray(mp[0][0][0]);

  if (looksLikePolygon) return [mp as number[][][]];
  if (looksLikeMulti) return mp as number[][][][];
  return [];
}

function boundsFromMulti(mp: MultiPolyLL) {
  let minLat = 90,
    maxLat = -90,
    minLon = 180,
    maxLon = -180;
  for (const poly of mp) {
    for (const ring of poly) {
      for (const [lat, lon] of ring) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
      }
    }
  }
  return {
    sw: [minLat, minLon] as LL,
    ne: [maxLat, maxLon] as LL,
  };
}

function stitchClosedRing(segments: RingLL[]): RingLL | null {
  if (!segments.length) return null;

  const segs = segments.map((s) => s.slice());
  segs.sort((a, b) => b.length - a.length);

  const ring: RingLL = segs.shift()!;

  let guard = 0;
  while (segs.length && guard++ < 20000) {
    const head = ring[0];
    const tail = ring[ring.length - 1];
    let attached = false;

    for (let i = 0; i < segs.length; i++) {
      let s = segs[i];
      const sHead = s[0];
      const sTail = s[s.length - 1];

      if (samePt(tail, sHead)) {
        ring.push(...s.slice(1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(tail, sTail)) {
        s = s.slice().reverse();
        ring.push(...s.slice(1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(head, sTail)) {
        ring.unshift(...s.slice(0, s.length - 1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(head, sHead)) {
        s = s.slice().reverse();
        ring.unshift(...s.slice(0, s.length - 1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
    }

    if (!attached) {
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const d =
          Math.hypot(s[0][0] - tail[0], s[0][1] - tail[1]) +
          Math.hypot(
            s[s.length - 1][0] - tail[0],
            s[s.length - 1][1] - tail[1]
          );
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx >= 0) {
        const s = segs.splice(bestIdx, 1)[0];
        const dHead = Math.hypot(s[0][0] - tail[0], s[0][1] - tail[1]);
        const dTail = Math.hypot(
          s[s.length - 1][0] - tail[0],
          s[s.length - 1][1] - tail[1]
        );
        const add = dHead < dTail ? s : s.slice().reverse();
        ring.push(...add.slice(1));
      } else break;
    }
  }

  if (!samePt(ring[0], ring[ring.length - 1])) ring.push(ring[0]);
  if (!samePt(ring[0], ring[ring.length - 1])) return null;
  return ring;
}

export const YandexMapComponent: FC<{ zoom?: number }> = ({ zoom = 10 }) => {
  const center: LL = [53.9, 27.566667];
  const mapRef = useRef<any>(null);

  const [mapType, setMapType] = useState<"yandex#map" | "yandex#satellite">(
    "yandex#map"
  );
  const [loading, setLoading] = useState(false);
  const [cityClipped, setCityClipped] = useState<MultiPolyLL>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const relQuery = `
          [out:json][timeout:25];
          rel(59195);
          out body;
          >;
          out skel qt;
        `;
        const relUrl =
          "https://overpass-api.de/api/interpreter?data=" +
          encodeURIComponent(relQuery);
        const relResp = await fetch(relUrl);
        if (!relResp.ok) throw new Error("Overpass boundary error");
        const relRaw = await relResp.json();

        // osmtogeojson соберёт корректный мультиполигон с дырками
        const gj: any = osmtogeojson(relRaw);
        const cityFeat =
          gj.features.find(
            (f: any) =>
              f.geometry &&
              (f.geometry.type === "MultiPolygon" ||
                f.geometry.type === "Polygon")
          ) || gj.features[0];

        if (!cityFeat?.geometry) {
          console.warn("Нет geometry у границы Минска.");
          setCityClipped([]);
          return;
        }

        const cityMultiLonLat: number[][][][] =
          cityFeat.geometry.type === "Polygon"
            ? [cityFeat.geometry.coordinates]
            : cityFeat.geometry.coordinates;

        /** === 2) МКАД: relation 176497 (официальный OSM relation для M9) === */
        const mkadRelQuery = `
          [out:json][timeout:25];
          rel(176497);
          out geom;        // важен out geom, чтобы были координаты узлов
        `;
        const mkadUrl =
          "https://overpass-api.de/api/interpreter?data=" +
          encodeURIComponent(mkadRelQuery);
        const mkadResp = await fetch(mkadUrl);
        if (!mkadResp.ok) throw new Error("Overpass MKAD error");
        const mkadData = await mkadResp.json();

        // Соберём все ways с geometry из relation-176497
        const mkadSegsLatLon: RingLL[] = [];
        for (const el of mkadData.elements || []) {
          // В некоторых ответах geometry лежит на members у relation; проверим оба сценария
          if (
            el.type === "way" &&
            Array.isArray(el.geometry) &&
            el.geometry.length >= 2
          ) {
            mkadSegsLatLon.push(el.geometry.map((g: any) => [g.lat, g.lon]));
          }
          if (el.type === "relation" && Array.isArray(el.members)) {
            for (const m of el.members) {
              if (
                m.type === "way" &&
                Array.isArray(m.geometry) &&
                m.geometry.length >= 2
              ) {
                mkadSegsLatLon.push(m.geometry.map((g: any) => [g.lat, g.lon]));
              }
            }
          }
        }

        if (!mkadSegsLatLon.length) {
          console.warn("МКАД не найден по relation 176497 (segments пусто).");
          setCityClipped([]);
          return;
        }

        const mkadRingLatLon = stitchClosedRing(mkadSegsLatLon);
        if (!mkadRingLatLon) {
          console.warn("Не удалось сшить МКАД в замкнутый контур.");
          setCityClipped([]);
          return;
        }
        if (
          !samePt(mkadRingLatLon[0], mkadRingLatLon[mkadRingLatLon.length - 1])
        ) {
          mkadRingLatLon.push(mkadRingLatLon[0]);
        }

        // Полигон «внутри МКАД» (lon/lat)
        const mkadPolyLonLat: number[][][][] = [[toLonLatRing(mkadRingLatLon)]];

        /** === 3) Пересечение: Минск ∩ (внутри МКАД) === */
        const clippedRaw = pc.intersection(
          cityMultiLonLat as any,
          mkadPolyLonLat as any
        );
        const clippedMultiLonLat = normalizePC(clippedRaw);

        if (!clippedMultiLonLat.length) {
          console.warn(
            "Пересечение пустое — возможно Overpass вернул разные версии данных. Обнови страницу или попробуй ещё раз."
          );
          setCityClipped([]);
          return;
        }

        // Переводим в формат Яндекса
        const resultYandex: MultiPolyLL = clippedMultiLonLat.map((poly) =>
          poly.map((ring) => toYandexRing(ring))
        );

        setCityClipped(resultYandex);

        // Подгоняем карту под итоговую геометрию
        // if (mapRef.current) {
        //   const { sw, ne } = boundsFromMulti(resultYandex);
        //   mapRef.current.setBounds([sw, ne], {
        //     checkZoomRange: true,
        //     duration: 400,
        //   });
        // }
      } catch (e) {
        console.error("Ошибка построения Минск∩МКАД:", e);
        setCityClipped([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const fitMapToCity = useCallback(() => {
    if (!mapRef.current || cityClipped.length === 0) return;

    const { sw, ne } = boundsFromMulti(cityClipped);
    mapRef.current.setBounds([sw, ne], {
      checkZoomRange: true,
      duration: 400,
    });
  }, [cityClipped]);

  useEffect(() => {
    fitMapToCity();
  }, [fitMapToCity]);
  /** UI-кнопки */
  const handleZoom = (dir: "in" | "out") => {
    if (!mapRef.current) return;
    const z = mapRef.current.getZoom();
    mapRef.current.setZoom(dir === "in" ? z + 1 : z - 1, { duration: 200 });
  };

  const handleType = () => {
    if (!mapRef.current) return;
    const next = mapType === "yandex#map" ? "yandex#satellite" : "yandex#map";
    setMapType(next);
    mapRef.current.setType(next);
  };

  const handleFullscreen = () => {
    const el = document.getElementById("yandex-map-container");
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LL = [pos.coords.latitude, pos.coords.longitude];
        mapRef.current.setCenter(coords, 14, { duration: 400 });
      },
      (err) => alert("Геолокация не доступна: " + err.message)
    );
  };

  const centerPin = useMemo(() => ({ balloonContent: "Центр Минска" }), []);

  return (
    // <YMaps
    //   query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY!, lang: "ru_RU" }}
    // >
    //   <div
    //     id="yandex-map-container"
    //     className="relative w-full overflow-hidden rounded-[16px] shadow-sm
    //                h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
    //   >
    //     {/* Верхние кнопки */}
    //     <div className="absolute z-10 top-3 right-3 flex flex-row gap-2">
    //       <button className={BTN} onClick={handleType} aria-label="Map type">
    //         {mapType === "yandex#map" ? (
    //           <MapIcon size={22} />
    //         ) : (
    //           <SatelliteDish size={22} />
    //         )}
    //       </button>
    //       <button
    //         className={BTN}
    //         onClick={handleFullscreen}
    //         aria-label="Fullscreen"
    //       >
    //         <Maximize2 size={22} />
    //       </button>
    //     </div>

    //     {/* Зум + геолокация */}
    //     <div className="absolute z-10 right-3 top-1/2 -translate-y-1/2 flex flex-col items-end">
    //       <div className="flex flex-col rounded-lg bg-white shadow-lg overflow-hidden">
    //         <button
    //           className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary rounded-t-lg"
    //           onClick={() => handleZoom("in")}
    //           aria-label="Zoom in"
    //         >
    //           <Plus size={22} />
    //         </button>
    //         <button
    //           className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary rounded-b-lg"
    //           onClick={() => handleZoom("out")}
    //           aria-label="Zoom out"
    //         >
    //           <Minus size={22} />
    //         </button>
    //       </div>
    //       <button
    //         className={BTN + " mt-3"}
    //         onClick={handleGeolocate}
    //         aria-label="Geolocate"
    //       >
    //         <LocateFixed size={22} />
    //       </button>
    //     </div>

    //     <Map
    //       instanceRef={(ref) => {
    //         if (!ref) return;
    //         mapRef.current = ref;
    //         fitMapToCity();
    //       }}
    //       defaultState={{
    //         center,
    //         zoom,
    //         controls: [],
    //         type: mapType,
    //         behaviors: ["drag", "dblClickZoom"],
    //       }}
    //       options={{
    //         suppressMapOpenBlock: true,
    //         suppressObsoleteBrowserNotifier: true,
    //         copyrightUaVisible: false,
    //         copyrightLogoVisible: false,
    //         copyrightProvidersVisible: false,
    //       }}
    //       width="100%"
    //       height="100%"
    //     >
    //       {cityClipped.length > 0 &&
    //         cityClipped.map((poly, i) => (
    //           <Polygon
    //             key={i}
    //             geometry={poly}
    //             options={{
    //               fill: true, // ← принудительно включаем заливку
    //               fillColor: "#7322C55E", // ← шестнадцатеричный цвет с альфой (примерно 45% непрозрачности)
    //               fillOpacity: 0.45,
    //               strokeColor: "#16a34a", // ← контур чуть темнее
    //               strokeOpacity: 1,
    //               strokeWidth: 2,
    //               zIndex: 1000,
    //             }}
    //           />
    //         ))}

    //       <Placemark geometry={center} properties={centerPin} />
    //     </Map>

    //     {loading && (
    //       <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-sm">
    //         <div className="animate-pulse rounded-md bg-white p-3 text-sm text-gray-600 shadow">
    //           Формирую Минск в пределах МКАД…
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </YMaps>
    <iframe
      src="https://yandex.ru/map-widget/v1/?um=constructor%3A9d67134e3c795dd5d919e41aa4dee173c5d5f7cd5b3465d543bc87089555bcbc&amp;source=constructor"
      frameBorder={0}
      allowFullScreen={true}
      width="100%"
      loading="lazy"
      className="rounded-2xl h-[350px] md:h-[600px]"
      style={{ display: "block" }}
    ></iframe>
  );
};
