import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Personas from "@/components/sections/Personas";
import Benefits from "@/components/sections/Benefits";
import Programs from "@/components/sections/Programs";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import ContactInfo from "@/components/sections/ContactInfo";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Personas />
      <Benefits />
      <Programs />
      <Testimonials />
      <FAQ />
      <ContactForm />
      <ContactInfo />
    </main>
  );
}
