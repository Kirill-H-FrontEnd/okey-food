"use client";
import React from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    mediaQuery.addListener(handleChange);

    handleChange();

    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
