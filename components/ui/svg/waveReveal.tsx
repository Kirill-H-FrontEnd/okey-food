import React from "react";

export const WaveReveal: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        height: "30px",
        marginTop: "10px",
      }}
    >
      <svg
        width="100%"
        height="30"
        viewBox="0 0 300 42"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="reveal-mask">
            <rect x="0" y="0" width="0" height="100%" fill="white">
              <animate
                attributeName="width"
                from="0"
                to="100%"
                dur="2s"
                fill="freeze"
              />
            </rect>
          </mask>
        </defs>

        <path
          d="M0.314542 22.3672C52.9464 14.9125 91.8245 33.6666 144.966 18.1254C147.46 24.7349 153.892 33.0058 163.497 33.1094C155.486 32.9725 142.641 15.7178 155.536 27.2686C163.119 36.0683 196.172 25.2364 170.842 32.944C188.334 31.2885 204.356 20.5339 216.163 10.9702C235.811 -2.65832 220.928 23.6737 235.178 36.8756C255.37 55.2242 316.463 7.29572 304.134 7.28816C296.296 13.2947 285.769 17.046 281.423 23.6985C204.757 63.1757 259.992 -9.72674 214.311 2.55426C139.744 53.2533 177.393 7.4163 133.572 10.6223C108.06 28.9946 -0.613806 0.46356 0.29434 22.3672L0.314542 22.3672Z"
          fill="#FFA900"
          mask="url(#reveal-mask)"
        />
      </svg>
    </div>
  );
};
