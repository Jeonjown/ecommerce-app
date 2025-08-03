import HeroBanner from "@/components/HeroBanner";
import NewArrival from "@/components/NewArrival";
import ProductCarousel from "@/components/ProductCarousel";

const Home = () => {
  return (
    <>
      <HeroBanner />
      {/* <Filters /> */}
      <ProductCarousel />
      <NewArrival />
    </>
  );
};

export default Home;
