import heroImage from "@/assets/hero-image.png";
import { Button } from "./ui/button";

import { motion } from "motion/react";
const HeroBanner = () => {
  return (
    <div className="mb-10 flex items-center bg-neutral-100 lg:px-15 xl:px-30">
      <div className="p-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
        >
          Grab Upto 50% Off <br /> On Selected Headphone
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button className="mt-5 lg:mt-15 lg:py-6 lg:text-lg xl:text-xl">
            Buy Now
          </Button>
        </motion.div>
      </div>

      <motion.img
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        src={heroImage}
        alt="hero-banner"
        className="ml-auto h-[28vh] pt-5 lg:h-[40vh] xl:h-[45vh]"
      />
    </div>
  );
};

export default HeroBanner;
