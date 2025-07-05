"use client";

import { FC, useEffect, useState } from "react";
import {
  YMaps,
  Map,
  Placemark,
  Polygon,
  ZoomControl,
} from "@pbe/react-yandex-maps";

export const YandexMapComponent: FC<{ zoom?: number }> = ({ zoom = 10 }) => {
  const center: [number, number] = [53.9, 27.566667];
  const [districtsCoords, setDistrictsCoords] = useState<
    [number, number][][][]
  >([]);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    fetch("/minsk-districts.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        setDistrictsCoords(
          (geojson.features as any).map(
            (f: any) => f.geometry.coordinates as [number, number][][]
          )
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mapRef || !(window as any).ymaps) return;
    const ymaps = (window as any).ymaps;
    ymaps
      .geocode("Minsk", { kind: "locality", results: 1 })
      .then((res: any) => {
        const city = res.geoObjects.get(0);
        city.options.set({
          fillColor: "rgba(255,0,0,0.2)",
          strokeColor: "#FF0000",
          strokeWidth: 2,
          zIndex: 500,
        });
        mapRef.geoObjects.add(city);
      });
  }, [mapRef]);

  return (
    <YMaps
      query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY!, lang: "ru_RU" }}
    >
      <div className="w-full pb-[56.25%] relative rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <Map
            instanceRef={setMapRef}
            defaultState={{
              center,
              zoom,
              controls: ["fullscreenControl", "typeSelector"],
              behaviors: ["drag", "dblClickZoom"],
            }}
            options={{
              suppressMapOpenBlock: true,
              suppressObsoleteBrowserNotifier: true,
              copyrightUaVisible: false,
              copyrightLogoVisible: false,
              copyrightProvidersVisible: false,
            }}
            modules={["control.FullscreenControl", "control.TypeSelector"]}
            width="100%"
            height="100%"
          >
            <ZoomControl
              options={{ position: { top: "250px", right: "10px" } }}
            />
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
      </div>
    </YMaps>
  );
};
