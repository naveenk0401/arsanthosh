import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/common/Hero";
import TrustBar from "@/components/common/Trustbar";
import AboutIntro from "@/components/common/AboutIntro";
import Services from "@/components/service/ServiceCard";
import StoreFeatured from "@/components/product/ProductCard";
import Awards from "@/components/common/Awards";
import SocialFeed from "@/components/common/SocialFeed";
import Reviews from "@/components/common/Reviews";
import ContactForm from "@/components/common/ContactForm";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <AboutIntro />
      <Services />
      <StoreFeatured />
      <Awards />
      <SocialFeed />
      <Reviews />
      <ContactForm />
      <Footer />
    </>
  );
}
