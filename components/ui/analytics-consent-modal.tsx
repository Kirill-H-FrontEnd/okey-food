"use client";

import * as React from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import Link from "next/link";

const GA_CONSENT_KEY = "ga-consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type ConsentStatus = "unknown" | "granted" | "denied";

export function AnalyticsConsentModal() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [consent, setConsent] = React.useState<ConsentStatus>("unknown");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(GA_CONSENT_KEY);

    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, []);

  const accept = () => {
    window.localStorage.setItem(GA_CONSENT_KEY, "granted");
    setConsent("granted");
    setIsVisible(false);
  };

  const decline = () => {
    window.localStorage.setItem(GA_CONSENT_KEY, "denied");
    setConsent("denied");
    setIsVisible(false);
  };

  return (
    <>
      {GA_ID && consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-6F1ZNPMD2E`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-6F1ZNPMD2E', {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut", delay: 0 }}
            className="
              fixed left-0 bottom-0 md:left-2 md:bottom-2 z-[9999]
              w-full md:w-[450px] md:max-w-[calc(100vw-32px)]
              rounded-t md:rounded-sm md:border border-black/10 bg-whiteSecondary/80 backdrop-blur-lg
              shadow-md p-4
            "
          >
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-colorPrimary">
                Мы используем cookies для работы сайта и аналитики. Продолжая
                пользоваться сайтом, вы{" "}
                <Link
                  className="text-yellow-hover hover:text-yellow-hover/60"
                  href="/privacy"
                >
                  соглашаетесь
                </Link>{" "}
                с этим.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  type="button"
                  onClick={accept}
                  className="bg-yellowPrimary font-semibold text-colorPrimary"
                >
                  Разрешить
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={decline}
                  className="font-semibold text-colorPrimary"
                >
                  Отказаться
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
