import {
  DEFAULT_KEYWORDS,
  createPageMetadata,
  JsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { PricingPageView } from "@/features/landing/components/pricing-page";
import { PRICING_HEADLINE } from "@/lib/constants/pricing";
import { landingFaqs } from "@/mocks/landing";

const title = "Pricing";
const description = PRICING_HEADLINE;
const path = "/pricing";

export const metadata = createPageMetadata({
  title,
  description,
  path,
  keywords: [
    ...DEFAULT_KEYWORDS,
    "CV download price",
    "cheap resume builder",
    "pay per CV download",
  ],
});

export default function PricingRoute() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ title, description, path }),
          faqPageJsonLd(landingFaqs.slice(0, 3)),
        ]}
      />
      <PricingPageView />
    </>
  );
}
