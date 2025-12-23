import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/Trustbar";
import AboutIntro from "./components/AboutIntro";
import Services from "./components/Services";
import StoreFeatured from "./components/StoreFeatured";
import Awards from "./components/Awards";
import SocialFeed from "./components/SocialFeed";
import Reviews from "./components/Reviews";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
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
