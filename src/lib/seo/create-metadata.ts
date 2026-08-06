import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/seo/config";

type CreatePageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  keywords?: readonly string[] | string[];
  /** Use an absolute document title (no root template suffix). */
  absoluteTitle?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  keywords = DEFAULT_KEYWORDS,
  absoluteTitle,
  noIndex = false,
  ogType = "website",
}: CreatePageMetadataOptions): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const socialTitle = absoluteTitle ?? `${title} — ${SITE_NAME}`;
  const pageUrl = absoluteUrl(canonical);

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords: [...keywords],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
