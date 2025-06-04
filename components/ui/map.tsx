"use client";
import { FC, useEffect, useRef } from "react";
import zonesGeoJson from "@/data/map.json"; // ваш файл GeoJSON

type MapProps = {
  width?: string;
  height?: string;
};

export const Map: FC<MapProps> = ({ width = "100%", height = "500px" }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    // @ts-ignore
    const google = window.google;
    if (!google || !google.maps) {
      console.error("Google Maps JS API не загружен");
      return;
    }

    // Центр Минска
    const center: google.maps.LatLngLiteral = {
      lat: 53.902496,
      lng: 27.561481,
    };

    // Инициализируем карту с вашим стилем
    const map = new google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [{ color: "#605915" }],
        },
        // сюда добавьте остальные правила из вашего JSON-стиля
      ],
    });

    // Вместо loadGeoJson используем addGeoJson, передавая импортированный объект
    map.data.addGeoJson(zonesGeoJson as any);

    // Назначаем стили в зависимости от свойства properties.zone
    map.data.setStyle((feature) => {
      const zone = feature.getProperty("zone") as string;
      switch (zone) {
        case "inner":
          return {
            fillColor: "#008000",
            fillOpacity: 0.35,
            strokeColor: "#006600",
            strokeWeight: 2,
          };
        case "middle":
          return {
            fillColor: "#FFFF00",
            fillOpacity: 0.25,
            strokeColor: "#CCCC00",
            strokeWeight: 2,
          };
        case "outer":
          return {
            fillColor: "#FF0000",
            fillOpacity: 0.15,
            strokeColor: "#990000",
            strokeWeight: 2,
          };
        default:
          return {
            fillColor: "#0000FF",
            fillOpacity: 0.1,
            strokeColor: "#000099",
            strokeWeight: 1,
          };
      }
    });

    // Маркер в центре (опционально)
    new google.maps.Marker({
      position: center,
      map,
      title: "Центр Минска",
    });
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width, height }}
      className="rounded-lg shadow-md"
    />
  );
};
