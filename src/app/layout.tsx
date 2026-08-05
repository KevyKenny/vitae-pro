import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants/navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://vitatepro.app",
  ),
  title: {
    default: `${APP_NAME} — AI CV & Cover Letter Builder`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  keywords: [
    "CV builder",
    "resume",
    "cover letter",
    "ATS",
    "AI career assistant",
    "VitatePro",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: `${APP_NAME} — AI CV & Cover Letter Builder`,
    description: APP_TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — AI CV & Cover Letter Builder`,
    description: APP_TAGLINE,
  },
  icons: {
    icon: [{ url: "/logo/vitaepro-favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo/vitaepro-mark.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
