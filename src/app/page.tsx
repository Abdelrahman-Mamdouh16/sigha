import { DocumentTypesSection } from "@/components/landing/document-types-section";
import { Hero } from "@/components/landing/hero";
import {
  CtaSection,
  HowItWorksSection,
  TrustSection,
  WhySighaSection,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <DocumentTypesSection />
        <HowItWorksSection />
        <WhySighaSection />
        <TrustSection />
        <CtaSection />
      </main>
    </>
  );
}
