import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CyberSecure Platform",
    short_name: "CyberSecure",
    description:
      "CyberSecure Platform - Empowering Cybercrime Reporting and Awareness",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["business", "productivity", "developer"],
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
  };
}
