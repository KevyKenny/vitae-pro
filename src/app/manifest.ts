import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#1F4D3D",
    icons: [
      {
        src: "/logo/vitaepro-favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo/vitaepro-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
