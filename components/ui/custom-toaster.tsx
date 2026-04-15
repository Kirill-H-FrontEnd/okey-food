"use client";

import { Toaster } from "react-hot-toast";

export const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          padding: "8px 10px",
          fontSize: "13px",
          fontWeight: "500",
          lineHeight: "1.4",
          maxWidth: "500px",
          minHeight: "42px",
          display: "flex",
          alignItems: "center",
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)",
          border: "1px solid transparent",
        },

        success: {
          style: {
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 45%, #c7f9d4 100%)",
            color: "#14532d",
            border: "1px solid #bbf7d0",
          },
          iconTheme: {
            primary: "#16a34a",
            secondary: "#f0fdf4",
          },
        },
        error: {
          style: {
            background:
              "linear-gradient(135deg, #fef2f2 0%, #fee2e2 45%, #ffd4d4 100%)",
            color: "#7f1d1d",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fef2f2",
          },
        },
        loading: {
          style: {
            background:
              "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #dbeafe 100%)",
            color: "#1e3a8a",
            border: "1px solid #bfdbfe",
          },
          iconTheme: {
            primary: "#2563eb",
            secondary: "#f0f9ff",
          },
        },
      }}
    />
  );
};
