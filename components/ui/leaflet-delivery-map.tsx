"use client";
import { FC, useEffect, useRef } from "react";

type LL = [number, number]; // [lat, lon] для Leaflet

const FILL_COLOR = "#7B2FC9";
const FILL_OPACITY = 0.35;
const STROKE_COLOR = "#5a1f99";
const STROKE_WEIGHT = 2;

const EPS = 1e-6;
const samePt = (a: LL, b: LL) =>
  Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;

function stitchClosedRing(segments: LL[][]): LL[] | null {
  if (!segments.length) return null;
  const segs = segments.map((s) => s.slice());
  segs.sort((a, b) => b.length - a.length);
  const ring: LL[] = segs.shift()!;
  let guard = 0;
  while (segs.length && guard++ < 30000) {
    const head = ring[0];
    const tail = ring[ring.length - 1];
    let attached = false;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      if (samePt(tail, s[0])) {
        ring.push(...s.slice(1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(tail, s[s.length - 1])) {
        ring.push(...s.slice().reverse().slice(1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(head, s[s.length - 1])) {
        ring.unshift(...s.slice(0, s.length - 1));
        segs.splice(i, 1);
        attached = true;
        break;
      }
      if (samePt(head, s[0])) {
        ring.unshift(
          ...s
            .slice()
            .reverse()
            .slice(0, s.length - 1),
        );
        segs.splice(i, 1);
        attached = true;
        break;
      }
    }
    if (!attached) {
      // жадно добавляем ближайший сегмент
      let best = -1,
        bestD = Infinity;
      const tail2 = ring[ring.length - 1];
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const d = Math.min(
          Math.hypot(s[0][0] - tail2[0], s[0][1] - tail2[1]),
          Math.hypot(
            s[s.length - 1][0] - tail2[0],
            s[s.length - 1][1] - tail2[1],
          ),
        );
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best < 0 || bestD > 0.001) break;
      const s = segs.splice(best, 1)[0];
      const dH = Math.hypot(s[0][0] - tail2[0], s[0][1] - tail2[1]);
      const dT = Math.hypot(
        s[s.length - 1][0] - tail2[0],
        s[s.length - 1][1] - tail2[1],
      );
      ring.push(...(dH < dT ? s : s.slice().reverse()).slice(1));
    }
  }
  if (!samePt(ring[0], ring[ring.length - 1])) ring.push(ring[0]);
  return ring.length >= 4 ? ring : null;
}

async function fetchMinskRing(): Promise<LL[] | null> {
  // out geom — геометрия inline, без отдельных нодов — намного компактнее
  const query = `[out:json][timeout:30];rel(59195);out geom;`;
  try {
    const resp = await fetch(
      "https://overpass-api.de/api/interpreter?data=" +
        encodeURIComponent(query),
    );
    if (!resp.ok) return null;
    const data = await resp.json();

    const segs: LL[][] = [];
    for (const el of data.elements ?? []) {
      // relation с членами
      if (el.type === "relation" && Array.isArray(el.members)) {
        for (const m of el.members) {
          if (
            m.type === "way" &&
            m.role !== "inner" &&
            Array.isArray(m.geometry) &&
            m.geometry.length >= 2
          ) {
            segs.push(
              m.geometry.map(
                (g: { lat: number; lon: number }) => [g.lat, g.lon] as LL,
              ),
            );
          }
        }
      }
      // отдельный way
      if (
        el.type === "way" &&
        Array.isArray(el.geometry) &&
        el.geometry.length >= 2
      ) {
        segs.push(
          el.geometry.map(
            (g: { lat: number; lon: number }) => [g.lat, g.lon] as LL,
          ),
        );
      }
    }
    return segs.length ? stitchClosedRing(segs) : null;
  } catch {
    return null;
  }
}

// Запасной контур — аппроксимация административной границы Минска
const MINSK_FALLBACK: LL[] = [
  [53.974, 27.48],
  [53.978, 27.52],
  [53.975, 27.565],
  [53.97, 27.615],
  [53.96, 27.665],
  [53.945, 27.71],
  [53.928, 27.748],
  [53.908, 27.768],
  [53.886, 27.762],
  [53.865, 27.742],
  [53.848, 27.71],
  [53.836, 27.668],
  [53.829, 27.618],
  [53.828, 27.565],
  [53.833, 27.512],
  [53.842, 27.462],
  [53.857, 27.418],
  [53.876, 27.388],
  [53.899, 27.372],
  [53.922, 27.376],
  [53.944, 27.397],
  [53.96, 27.43],
  [53.971, 27.455],
  [53.974, 27.48],
];

export const LeafletDeliveryMap: FC<{ zoom?: number }> = ({ zoom = 11 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let destroyed = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (destroyed || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [53.9, 27.567],
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control
        .attribution({ position: "bottomleft", prefix: "© OpenStreetMap" })
        .addTo(map);

      mapRef.current = map;

      const polyStyle = {
        color: STROKE_COLOR,
        weight: STROKE_WEIGHT,
        fillColor: FILL_COLOR,
        fillOpacity: FILL_OPACITY,
        opacity: 0.9,
      };

      // Сразу показываем запасной контур
      const fallbackPoly = L.polygon(MINSK_FALLBACK, polyStyle).addTo(map);
      map.fitBounds(fallbackPoly.getBounds(), { padding: [20, 20] });

      // Пробуем загрузить точный контур из Overpass
      const ring = await fetchMinskRing();
      if (destroyed) return;

      if (ring && ring.length > 10) {
        fallbackPoly.remove();
        const exactPoly = L.polygon(ring, polyStyle).addTo(map);
        try {
          map.fitBounds(exactPoly.getBounds(), { padding: [20, 20] });
        } catch {}
      }
    };

    initMap();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [zoom]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl h-[350px] md:h-[600px] overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
};
