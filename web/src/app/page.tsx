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

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Navigation />
      <main id="main-content" className="min-h-0 flex-1">
        <Hero />
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
