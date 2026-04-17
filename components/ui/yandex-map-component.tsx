"use client";

import { FC, useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minus,
  Plus,
  LocateFixed,
  Map as MapIcon,
  SatelliteDish,
} from "lucide-react";
import osmtogeojson from "osmtogeojson";

const BTN =
  "w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-primary";

function loadYmaps3Script(): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    if (win.__ymaps3Loaded) {
      resolve();
      return;
    }
    if (win.__ymaps3Loading) {
      win.__ymaps3LoadCallbacks = win.__ymaps3LoadCallbacks || [];
      win.__ymaps3LoadCallbacks.push({ resolve, reject });
      return;
    }
    win.__ymaps3Loading = true;
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YANDEX_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      win.__ymaps3Loaded = true;
      resolve();
      (win.__ymaps3LoadCallbacks || []).forEach((cb: any) => cb.resolve());
    };
    script.onerror = (e) => {
      reject(new Error("Скрипт Яндекс Карт v3 не загрузился"));
      (win.__ymaps3LoadCallbacks || []).forEach((cb: any) => cb.reject(e));
    };
    document.head.appendChild(script);
  });
}

async function getYmaps3(): Promise<any> {
  await loadYmaps3Script();
  const ymaps3 = (window as any).ymaps3;
  if (!ymaps3) throw new Error("ymaps3 не определён после загрузки скрипта");
  // ready может отклоняться при ошибке ключа — обрабатываем мягко
  try {
    await ymaps3.ready;
  } catch (_) {
    /* continue anyway */
  }
  return ymaps3;
}

async function fetchOuterRings(overpassQuery: string): Promise<number[][][]> {
  try {
    const url =
      "https://overpass-api.de/api/interpreter?data=" +
      encodeURIComponent(overpassQuery);
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const raw = await resp.json();
    const gj: any = osmtogeojson(raw);
    const rings: number[][][] = [];
    for (const feat of gj.features as any[]) {
      const g = feat?.geometry;
      if (!g) continue;
      if (g.type === "Polygon") rings.push(g.coordinates[0]);
      else if (g.type === "MultiPolygon") {
        for (const poly of g.coordinates) rings.push(poly[0]);
      }
    }
    return rings;
  } catch {
    return [];
  }
}

const MINSK_QUERY = `[out:json][timeout:30];rel(59195);out body;>;out skel qt;`;
const KOPISHCHE_QUERY = `[out:json][timeout:25];
(
  relation["name"="Копище"]["boundary"="administrative"](53.78,27.60,53.90,27.80);
  relation["name"="Копище"](53.78,27.60,53.90,27.80);
);
out body;>;out skel qt;`;

export const YandexMapComponent: FC<{ zoom?: number }> = ({ zoom = 11 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const schemeRef = useRef<any>(null);
  const satRef = useRef<any>(null);
  const featLayerRef = useRef<any>(null);

  const [isSatellite, setIsSatellite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let destroyed = false;

    (async () => {
      try {
        const ymaps3 = await getYmaps3();
        if (destroyed || !containerRef.current) return;

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultSatelliteLayer,
          YMapDefaultFeaturesLayer,
          YMapFeature,
        } = ymaps3;

        // Карта
        const map = new YMap(containerRef.current, {
          location: { center: [27.567, 53.9], zoom },
          behaviors: ["drag", "scrollZoom", "dblClickZoom"],
        });
        mapRef.current = map;

        // Слои
        const scheme = new YMapDefaultSchemeLayer({});
        schemeRef.current = scheme;
        map.addChild(scheme);

        const sat = new YMapDefaultSatelliteLayer({});
        satRef.current = sat;

        if (YMapDefaultFeaturesLayer) {
          const fl = new YMapDefaultFeaturesLayer({});
          featLayerRef.current = fl;
          map.addChild(fl);
        }

        // Загружаем полигоны
        const [minskRings, kopRings] = await Promise.all([
          fetchOuterRings(MINSK_QUERY),
          fetchOuterRings(KOPISHCHE_QUERY),
        ]);

        if (destroyed) return;

        const allRings = [...minskRings, ...kopRings];

        for (let i = 0; i < allRings.length; i++) {
          const feat = new YMapFeature({
            id: `zone-${i}`,
            geometry: { type: "Polygon", coordinates: [allRings[i]] },
            style: {
              fill: "rgba(123,47,201,0.35)",
              stroke: [{ color: "#5a1f99", width: 2 }],
            },
          });
          map.addChild(feat);
        }

        // Центрируем на Минске
        if (minskRings.length > 0) {
          let minLon = 180,
            maxLon = -180,
            minLat = 90,
            maxLat = -90;
          for (const ring of minskRings) {
            for (const [lon, lat] of ring) {
              if (lon < minLon) minLon = lon;
              if (lon > maxLon) maxLon = lon;
              if (lat < minLat) minLat = lat;
              if (lat > maxLat) maxLat = lat;
            }
          }
          try {
            map.setLocation({
              bounds: [
                [minLon, minLat],
                [maxLon, maxLat],
              ],
              duration: 300,
            });
          } catch {
            map.setLocation({ center: [27.567, 53.9], zoom: 11 });
          }
        }

        setLoading(false);
      } catch (e: any) {
        if (!destroyed) {
          console.error("Карта:", e);
          setError(String(e?.message || e));
          setLoading(false);
        }
      }
    })();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        try {
          mapRef.current.destroy();
        } catch {}
        mapRef.current = null;
      }
    };
  }, [zoom]);

  const handleZoom = (dir: "in" | "out") => {
    const map = mapRef.current;
    if (!map) return;
    try {
      map.setLocation({
        zoom: map.zoom + (dir === "in" ? 1 : -1),
        duration: 200,
      });
    } catch {}
  };

  const handleSatellite = () => {
    const map = mapRef.current;
    if (!map || !schemeRef.current || !satRef.current) return;
    try {
      if (isSatellite) {
        map.removeChild(satRef.current);
        map.addChild(schemeRef.current, 0);
      } else {
        map.removeChild(schemeRef.current);
        map.addChild(satRef.current, 0);
      }
      setIsSatellite((v) => !v);
    } catch {}
  };

  const handleFullscreen = () => {
    const el = document.getElementById("yandex-map-container");
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleGeolocate = () => {
    const map = mapRef.current;
    if (!navigator.geolocation || !map) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          map.setLocation({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 14,
            duration: 400,
          });
        } catch {}
      },
      (err) => alert("Геолокация недоступна: " + err.message),
    );
  };

  return (
    <div
      id="yandex-map-container"
      className="relative w-full overflow-hidden rounded-[16px] shadow-sm h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
    >
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 0 }} />

      {!error && (
        <>
          <div className="absolute z-10 top-3 right-3 flex flex-row gap-2">
            <button
              className={BTN}
              onClick={handleSatellite}
              aria-label="Тип карты"
            >
              {isSatellite ? (
                <MapIcon size={22} />
              ) : (
                <SatelliteDish size={22} />
              )}
            </button>
            <button
              className={BTN}
              onClick={handleFullscreen}
              aria-label="Полный экран"
            >
              <Maximize2 size={22} />
            </button>
          </div>

          <div className="absolute z-10 right-3 top-1/2 -translate-y-1/2 flex flex-col items-end">
            <div className="flex flex-col rounded-lg bg-white shadow-lg overflow-hidden">
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-primary rounded-t-lg"
                onClick={() => handleZoom("in")}
                aria-label="Приблизить"
              >
                <Plus size={22} />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-primary rounded-b-lg"
                onClick={() => handleZoom("out")}
                aria-label="Отдалить"
              >
                <Minus size={22} />
              </button>
            </div>
            <button
              className={BTN + " mt-3"}
              onClick={handleGeolocate}
              aria-label="Геолокация"
            >
              <LocateFixed size={22} />
            </button>
          </div>
        </>
      )}

      {loading && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-sm">
          <div className="animate-pulse rounded-md bg-white p-3 text-sm text-gray-600 shadow">
            Загрузка зоны доставки…
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[16px]">
          <p className="text-sm text-gray-500 px-6 text-center">
            Карта недоступна: {error}
          </p>
        </div>
      )}
    </div>
  );
};
