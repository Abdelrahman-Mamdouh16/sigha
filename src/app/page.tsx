import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { DocumentTypesSection } from "@/components/landing/document-types-section";
import {
  HowItWorksSection,
  WhySighaSection,
  TrustSection,
  CtaSection,
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
