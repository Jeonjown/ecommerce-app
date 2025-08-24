import gadgets from "@/assets/gadgets.png";

import { Button } from "./ui/button";

import { motion } from "motion/react";
import { Link } from "react-router-dom";
const HeroBanner = () => {
  return (
    <div className="bg-muted mb-10 flex flex-col items-center gap-5 border px-5 py-10 sm:px-10 lg:flex-row lg:justify-between lg:px-15 lg:py-0 xl:px-30">
      {/* Image */}
      <motion.img
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        src={gadgets}
        alt="promo-banner"
        className="h-[28vh] sm:h-[35vh] lg:mr-20 lg:h-[40vh] xl:h-[45vh]"
      />

      {/* Text + Button */}
      <div className="text-center lg:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
        >
          Your All in One Tech Destination
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            asChild
            className="mt-5 lg:mt-8 lg:py-6 lg:text-lg xl:text-xl"
          >
            <Link to={"/categories"}>Shop Now</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
