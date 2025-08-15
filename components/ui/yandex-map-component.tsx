"use client";

import { FC, useEffect, useRef, useState } from "react";
import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import {
  Maximize2,
  Minus,
  Plus,
  LocateFixed,
  Map as MapIcon,
  SatelliteDish,
} from "lucide-react";

const BTN =
  "w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary";

export const YandexMapComponent: FC<{ zoom?: number }> = ({ zoom = 10 }) => {
  const center: [number, number] = [53.9, 27.566667];
  const [districtsCoords, setDistrictsCoords] = useState<
    [number, number][][][]
  >([]);
  const mapRef = useRef<any>(null);
  const [mapType, setMapType] = useState<"yandex#map" | "yandex#satellite">(
    "yandex#map"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch("/minsk-districts.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        setDistrictsCoords(
          geojson.features.map((f: any) =>
            f.geometry.coordinates.map((polygon: [number, number][]) =>
              polygon.map(([lat, lon]) => [lon, lat])
            )
          )
        );
      })
      .catch(console.error);
  }, []);

  const handleZoom = (dir: "in" | "out") => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const currentZoom = map.getZoom();
    map.setZoom(dir === "in" ? currentZoom + 1 : currentZoom - 1);
  };

  const handleType = () => {
    if (!mapRef.current) return;
    const nextType =
      mapType === "yandex#map" ? "yandex#satellite" : "yandex#map";
    setMapType(nextType);
    mapRef.current.setType(nextType);
  };

  const handleFullscreen = () => {
    const container = document.getElementById("yandex-map-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        mapRef.current.setCenter(coords, 14, { duration: 400 });
      },
      (err) => {
        alert("Геолокация не доступна: " + err.message);
      }
    );
  };

  return (
    <YMaps
      query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY!, lang: "ru_RU" }}
    >
      <div
        id="yandex-map-container"
        className="
        shadow-sm
          w-full
          h-[350px]
          sm:h-[400px]
          md:h-[500px]
          lg:h-[550px]
          relative
          rounded-[16px]
          overflow-hidden
        "
      >
        <div className="absolute z-10 top-3 right-3 flex flex-row gap-2">
          <button className={BTN} onClick={handleType} aria-label="Map type">
            {mapType === "yandex#map" ? (
              <MapIcon size={22} />
            ) : (
              <SatelliteDish size={22} />
            )}
          </button>
          {/* Фуллскрин */}
          <button
            className={BTN}
            onClick={handleFullscreen}
            aria-label="Fullscreen"
          >
            <Maximize2 size={22} />
          </button>
        </div>
        {/* Зум и геолокация по центру справа */}
        <div className="absolute z-10 right-3 top-1/2 -translate-y-1/2 flex flex-col items-end">
          <div className="flex flex-col shadow-lg bg-white rounded-lg overflow-hidden ">
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary rounded-t-lg"
              onClick={() => handleZoom("in")}
              aria-label="Zoom in"
            >
              <Plus size={22} />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all text-greenPrimary rounded-b-lg"
              onClick={() => handleZoom("out")}
              aria-label="Zoom out"
            >
              <Minus size={22} />
            </button>
          </div>
          <button
            className={BTN + " mt-3"}
            onClick={handleGeolocate}
            aria-label="Geolocate"
          >
            <LocateFixed size={22} />
          </button>
        </div>
        <Map
          instanceRef={(ref) => (mapRef.current = ref)}
          defaultState={{
            center,
            zoom,
            controls: [],
            type: mapType,
            behaviors: ["drag", "dblClickZoom"],
          }}
          options={{
            suppressMapOpenBlock: true,
            suppressObsoleteBrowserNotifier: true,
            copyrightUaVisible: false,
            copyrightLogoVisible: false,
            copyrightProvidersVisible: false,
          }}
          width="100%"
          height="100%"
        >
          {districtsCoords.map((coords, idx) => (
            <Polygon
              key={idx}
              geometry={coords}
              options={{
                fillColor: "rgba(0,200,0,0.3)",
                strokeColor: "#00C800",
                strokeWidth: 3,
                zIndex: 1000,
              }}
            />
          ))}
          <Placemark
            geometry={center}
            properties={{ balloonContent: "Центр Минска" }}
          />
        </Map>
      </div>
    </YMaps>
  );
};
