import { ContactPage } from "@/features/public/components/contact-page";
import {
  createPageMetadata,
  JsonLd,
  contactPageJsonLd,
  PUBLIC_MARKETING_ROUTES,
} from "@/lib/seo";
import { contactFaqs } from "@/mocks/public-pages";

const route = PUBLIC_MARKETING_ROUTES.find((r) => r.path === "/contact")!;

export const metadata = createPageMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  keywords: [
    "contact VitatePro",
    "CV builder support",
    "resume help",
    "career product support",
  ],
});

export default function ContactRoute() {
  return (
    <>
      <JsonLd
        data={contactPageJsonLd({
          description: route.description,
          faqs: contactFaqs,
        })}
      />
      <ContactPage />
    </>
  );
}
