import { PrivacyPage } from "@/features/public/components/privacy-page";
import {
  createPageMetadata,
  JsonLd,
  webPageJsonLd,
  PUBLIC_MARKETING_ROUTES,
} from "@/lib/seo";

const route = PUBLIC_MARKETING_ROUTES.find((r) => r.path === "/privacy")!;

export const metadata = createPageMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  keywords: [
    "VitatePro privacy",
    "CV data protection",
    "AI resume privacy",
    "personal data policy",
  ],
});

export default function PrivacyRoute() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: route.title,
          description: route.description,
          path: route.path,
        })}
      />
      <PrivacyPage />
    </>
  );
}
