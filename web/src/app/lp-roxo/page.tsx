import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { BrandOrigin } from "@/components/sections/BrandOrigin";
import { Network } from "@/components/sections/Network";
import { Telemedicine } from "@/components/sections/Telemedicine";
import { Specialists } from "@/components/sections/Specialists";
import { HealthExperience } from "@/components/sections/HealthExperience";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Amélia Saúde | Plano de saúde moderno",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LpRoxo() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Navigation />
      <main id="main-content" className="min-h-0 flex-1">
        <Hero
          imageSrc="/maria-padilha-look-roxo.webp"
          imageWidth={878}
          imageHeight={1792}
          /* Foto no aspect exato (sem cortar a pessoa); sangra só pela direita. */
          mobilePhotoTop="11rem"
          mobilePhotoRight="-26vw"
          mobileCopyPad="47vw"
          headlineClassName="mb-3 w-full tracking-tight lg:mb-7"
        />
        <BrandOrigin />
        <HealthExperience />
        <Network />
        <Telemedicine />
        <Specialists />
        <Contact />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
