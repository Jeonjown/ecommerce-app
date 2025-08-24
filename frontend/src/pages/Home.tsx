import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanner from "@/components/PromoBanner";
import TopCategories from "@/components/TopCategories";

const Home = () => {
  return (
    <>
      <HeroBanner />
      {/* <Filters /> */}
      <ProductCarousel />
      <PromoBanner />
      <TopCategories />

      {/* <NewArrival /> */}

      <Footer />
    </>
  );
};

export default Home;
