"use client";

import { useEffect, useState } from "react";

import { Loader } from "@/components/ui/loader";

const waitForImages = () => {
  const images = Array.from(document.images);

  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const cleanup = () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onLoad);
          resolve();
        };
        const onLoad = () => cleanup();

        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onLoad, { once: true });
      });
    }),
  );
};

export const InitialLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }

      await waitForImages();

      if (!cancelled) {
        setIsVisible(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-whitePrimary">
      <Loader />
    </div>
  );
};
