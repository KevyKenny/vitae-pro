import { TermsPage } from "@/features/public/components/terms-page";
import {
  createPageMetadata,
  JsonLd,
  webPageJsonLd,
  PUBLIC_MARKETING_ROUTES,
} from "@/lib/seo";

const route = PUBLIC_MARKETING_ROUTES.find((r) => r.path === "/terms")!;

export const metadata = createPageMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  keywords: [
    "VitatePro terms",
    "terms of service",
    "CV builder terms",
    "acceptable use",
  ],
});

export default function TermsRoute() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: route.title,
          description: route.description,
          path: route.path,
        })}
      />
      <TermsPage />
    </>
  );
}
