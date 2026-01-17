import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import PlatformLogos from '@/components/PlatformLogos';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <PlatformLogos />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
