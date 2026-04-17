"use client";

import { FC, useEffect, useState } from "react";
import Map, { Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";

type LonLat = [number, number];

const EPS = 1e-6;
const same = (a: LonLat, b: LonLat) =>
  Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;

function stitchRing(segs: LonLat[][]): LonLat[] | null {
  if (!segs.length) return null;
  const pool = segs.map((s) => s.slice());
  pool.sort((a, b) => b.length - a.length);
  const ring: LonLat[] = pool.shift()!;
  let guard = 0;
  while (pool.length && guard++ < 50000) {
    const tail = ring[ring.length - 1];
    let hit = false;
    for (let i = 0; i < pool.length; i++) {
      const s = pool[i];
      if (same(tail, s[0])) {
        ring.push(...s.slice(1));
        pool.splice(i, 1);
        hit = true;
        break;
      }
      if (same(tail, s[s.length - 1])) {
        ring.push(...s.slice().reverse().slice(1));
        pool.splice(i, 1);
        hit = true;
        break;
      }
    }
    if (!hit) break;
  }
  if (!same(ring[0], ring[ring.length - 1])) ring.push(ring[0]);
  return ring.length >= 4 ? ring : null;
}

async function fetchMkadGeoJson(): Promise<GeoJSON.FeatureCollection | null> {
  try {
    const query = `[out:json][timeout:25];relation(176497);out geom;`;
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const rel = (data.elements ?? []).find((e: any) => e.type === "relation");
    if (!rel) return null;

    const segs: LonLat[][] = (rel.members ?? [])
      .filter(
        (m: any) =>
          m.type === "way" &&
          Array.isArray(m.geometry) &&
          m.geometry.length >= 2,
      )
      .map((m: any) =>
        m.geometry.map(
          (g: { lat: number; lon: number }) => [g.lon, g.lat] as LonLat,
        ),
      );

    const ring = stitchRing(segs);
    if (!ring || ring.length < 4) return null;

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [ring] },
          properties: {},
        },
      ],
    };
  } catch {
    return null;
  }
}

// Реальные координаты МКАД (Минская кольцевая автодорога, rel 176497)
const MKAD_RING: LonLat[] = [
  [27.6619516, 53.8401233],
  [27.6600064, 53.8388596],
  [27.6558919, 53.8368752],
  [27.6511656, 53.8353011],
  [27.647367, 53.8344441],
  [27.6438557, 53.833968],
  [27.6389725, 53.8336995],
  [27.6300264, 53.8336394],
  [27.6222504, 53.8335795],
  [27.6071921, 53.833455],
  [27.5945718, 53.8333545],
  [27.578004, 53.8331782],
  [27.5706789, 53.8331345],
  [27.5587106, 53.8330434],
  [27.554104, 53.8331656],
  [27.5406959, 53.8346489],
  [27.5327039, 53.8355285],
  [27.5252792, 53.8363847],
  [27.5141987, 53.8375829],
  [27.5095493, 53.8380943],
  [27.4993524, 53.8392015],
  [27.4948859, 53.839682],
  [27.4798056, 53.8413],
  [27.4754602, 53.8418757],
  [27.4686839, 53.8426996],
  [27.4646086, 53.8430537],
  [27.4542078, 53.8441673],
  [27.448895, 53.8450527],
  [27.4449456, 53.8461548],
  [27.4415716, 53.8474366],
  [27.4391368, 53.8486754],
  [27.436472, 53.850249],
  [27.4338099, 53.8521783],
  [27.4313727, 53.8544318],
  [27.4296778, 53.8565281],
  [27.4262001, 53.8629975],
  [27.4222327, 53.8709201],
  [27.4198814, 53.8754172],
  [27.4177978, 53.8797479],
  [27.4162652, 53.8830985],
  [27.410427, 53.8948565],
  [27.408819, 53.8981754],
  [27.4074381, 53.902346],
  [27.4074961, 53.9049839],
  [27.40818, 53.90764],
  [27.4106235, 53.9126901],
  [27.4121907, 53.9160904],
  [27.4139099, 53.9196217],
  [27.4166329, 53.9241898],
  [27.4185724, 53.9268392],
  [27.4216966, 53.9307476],
  [27.4278708, 53.9369603],
  [27.4307891, 53.9394563],
  [27.4347011, 53.9424601],
  [27.4362803, 53.9436636],
  [27.4387378, 53.9455277],
  [27.4432258, 53.9489054],
  [27.4461543, 53.9511325],
  [27.4491987, 53.9534897],
  [27.4544868, 53.9574693],
  [27.4574491, 53.9597468],
  [27.4591121, 53.9609414],
  [27.4641399, 53.9635735],
  [27.4687804, 53.9652303],
  [27.4712365, 53.9658308],
  [27.477868, 53.9668687],
  [27.485572, 53.9673257],
  [27.4995831, 53.9679304],
  [27.5058185, 53.9681892],
  [27.5136091, 53.9683721],
  [27.520654, 53.9686715],
  [27.5301481, 53.969083],
  [27.5434065, 53.9696566],
  [27.5493868, 53.9699268],
  [27.5544499, 53.9701423],
  [27.5604324, 53.9704005],
  [27.5673095, 53.970673],
  [27.5818139, 53.9712937],
  [27.5886383, 53.9711297],
  [27.5930283, 53.9706218],
  [27.5973462, 53.969787],
  [27.6002254, 53.969031],
  [27.6036082, 53.9679045],
  [27.6148382, 53.9639541],
  [27.6190711, 53.9624922],
  [27.6260446, 53.9600294],
  [27.6305695, 53.9584657],
  [27.6576879, 53.9487789],
  [27.6667728, 53.9455044],
  [27.6704465, 53.9440487],
  [27.6714421, 53.9433611],
  [27.6722564, 53.942362],
  [27.673076, 53.9405093],
  [27.6766695, 53.9318655],
  [27.6788362, 53.9266235],
  [27.6800887, 53.9236635],
  [27.6807654, 53.9221472],
  [27.6819583, 53.9192523],
  [27.6833325, 53.9157875],
  [27.6838882, 53.9143749],
  [27.6860882, 53.9091225],
  [27.6894474, 53.9008945],
  [27.6910963, 53.8969123],
  [27.6934044, 53.8910661],
  [27.6943149, 53.8887632],
  [27.6961288, 53.8842628],
  [27.6966233, 53.881445],
  [27.6963137, 53.8783111],
  [27.6949043, 53.8749797],
  [27.6918214, 53.8707564],
  [27.6892703, 53.8673987],
  [27.6855557, 53.8636951],
  [27.6825261, 53.8606001],
  [27.6793186, 53.8573726],
  [27.6775232, 53.8555311],
  [27.6738784, 53.8517808],
  [27.6709278, 53.8487689],
  [27.6697333, 53.8475378],
  [27.6657694, 53.8434935],
  [27.6630299, 53.8409311],
  [27.6619516, 53.8401233],
];

// Реальные координаты Копища (деревня, Мінскі раён, rel 6891928)
const KOPISHCHE_RING: LonLat[] = [
  [27.6767218, 53.9598294],
  [27.6767322, 53.9601286],
  [27.6766615, 53.9605887],
  [27.6762006, 53.961326],
  [27.6761113, 53.9624505],
  [27.6758137, 53.9629398],
  [27.6746943, 53.9637006],
  [27.6717363, 53.964183],
  [27.6679883, 53.9646204],
  [27.6642212, 53.9648939],
  [27.6627712, 53.9649333],
  [27.6582362, 53.9654226],
  [27.6536915, 53.9655671],
  [27.6488535, 53.9660468],
  [27.6481797, 53.9659801],
  [27.6476694, 53.9657287],
  [27.649271, 53.9649243],
  [27.648054, 53.9640217],
  [27.6477244, 53.9638887],
  [27.6476061, 53.9629304],
  [27.6481803, 53.9623761],
  [27.6492482, 53.9615413],
  [27.6503822, 53.9600791],
  [27.652116, 53.958119],
  [27.6545938, 53.9566866],
  [27.6547596, 53.9558061],
  [27.6559433, 53.9555259],
  [27.6571541, 53.9541503],
  [27.6566883, 53.9542043],
  [27.6563726, 53.9544636],
  [27.6561432, 53.9545721],
  [27.6556929, 53.9545477],
  [27.6557563, 53.954379],
  [27.6561678, 53.9539973],
  [27.6560861, 53.9537504],
  [27.6575478, 53.9539225],
  [27.6609282, 53.9514587],
  [27.6603448, 53.9499916],
  [27.6609857, 53.9497419],
  [27.6625587, 53.9492783],
  [27.6631366, 53.9494672],
  [27.6641829, 53.9508307],
  [27.6718526, 53.9519098],
  [27.6719329, 53.9517351],
  [27.6722512, 53.9518182],
  [27.6724814, 53.9516044],
  [27.672413, 53.9514866],
  [27.6720469, 53.9513526],
  [27.6720679, 53.9513108],
  [27.6720619, 53.950972],
  [27.6720903, 53.9505677],
  [27.672389, 53.9502933],
  [27.6726572, 53.9501824],
  [27.6746072, 53.9508125],
  [27.6749959, 53.9507852],
  [27.6792999, 53.9525389],
  [27.6797427, 53.9531906],
  [27.6803756, 53.952494],
  [27.6802575, 53.9531105],
  [27.6804267, 53.953281],
  [27.6808355, 53.9532269],
  [27.6808903, 53.9531289],
  [27.6819384, 53.9534672],
  [27.6819567, 53.9535553],
  [27.6818605, 53.9536663],
  [27.6815024, 53.9540792],
  [27.6794061, 53.9536635],
  [27.6789229, 53.9539097],
  [27.6781837, 53.9543191],
  [27.6777392, 53.9545773],
  [27.677361, 53.9550005],
  [27.6773, 53.9555322],
  [27.677005, 53.9564114],
  [27.6769368, 53.9566783],
  [27.676715, 53.9579378],
  [27.6765979, 53.9590204],
  [27.6767218, 53.9598294],
];

const toGeoJson = (ring: LonLat[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [ring] },
      properties: {},
    },
  ],
});

const KOPISHCHE_GEOJSON: GeoJSON.FeatureCollection = toGeoJson(KOPISHCHE_RING);

const fillLayer: Omit<FillLayerSpecification, "source"> = {
  id: "mkad-fill",
  type: "fill",
  paint: { "fill-color": "#7B2FC9", "fill-opacity": 0.35 },
};

const lineLayer: Omit<LineLayerSpecification, "source"> = {
  id: "mkad-line",
  type: "line",
  paint: { "line-color": "#5a1f99", "line-width": 2 },
};

const kopFillLayer: Omit<FillLayerSpecification, "source"> = {
  id: "kop-fill",
  type: "fill",
  paint: { "fill-color": "#F97316", "fill-opacity": 0.45 },
};

const kopLineLayer: Omit<LineLayerSpecification, "source"> = {
  id: "kop-line",
  type: "line",
  paint: { "line-color": "#c05510", "line-width": 2 },
};

export const MaplibreDeliveryMap: FC<{ zoom?: number }> = ({ zoom = 10 }) => {
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection>(() =>
    toGeoJson(MKAD_RING),
  );

  useEffect(() => {
    fetchMkadGeoJson().then((data) => {
      if (data) setGeoJson(data);
    });
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden h-[350px] md:h-[600px]">
      <Map
        initialViewState={{ longitude: 27.585, latitude: 53.91, zoom }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        attributionControl={false}
        onLoad={(e) => {
          const map = e.target;
          map.getStyle().layers.forEach((layer) => {
            if (
              layer.type === "symbol" &&
              (layer.layout as any)?.["text-field"]
            ) {
              map.setLayoutProperty(layer.id, "text-field", [
                "coalesce",
                ["get", "name:ru"],
                ["get", "name"],
              ]);
            }
          });
        }}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* МКАД — зона доставки */}
        <Source id="mkad-zone" type="geojson" data={geoJson}>
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Source>

        {/* Копище */}
        <Source id="kop-zone" type="geojson" data={KOPISHCHE_GEOJSON}>
          <Layer {...kopFillLayer} />
          <Layer {...kopLineLayer} />
        </Source>
      </Map>
    </div>
  );
};
