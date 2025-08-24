import { Link } from "react-router-dom";
import smartphones from "../assets/smartphones.png";
import laptops from "../assets/laptops.png";
import gaming_console from "../assets/gaming-console.png";
import pc_components from "../assets/pc-components.png";
import tablets from "../assets/tablets.png";
import audio from "../assets/audio.png";

import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { name: "Smartphones", image: smartphones, path: "/categories/smartphones" },
  {
    name: "Consoles",
    image: gaming_console,
    path: "/categories/gaming-consoles",
  },
  { name: "Laptops", image: laptops, path: "/categories/laptops" },
  { name: "Desktops", image: pc_components, path: "/categories/pc-components" },
  { name: "Audio", image: audio, path: "/categories/audio-headphones" },
  { name: "Tablets", image: tablets, path: "/categories/tablets-e-readers" },
];

const TopCategories = ({ isLoading = false }: { isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="relative my-20 mt-8">
        <Skeleton className="m-5 h-7 w-64" />

        <div className="grid grid-cols-2 gap-6 px-5 sm:grid-cols-3 md:px-0 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="relative block rounded-xl border">
              {/* Title skeleton */}
              <Skeleton className="absolute top-5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-md" />

              {/* Image skeleton */}
              <Skeleton className="aspect-[4/5] h-64 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="relative my-20 mt-8"
    >
      <h2 className="m-5 text-2xl font-bold">Shop Our Top Categories</h2>

      <div className="grid grid-cols-2 gap-6 px-5 sm:grid-cols-3 md:px-0 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            to={cat.path}
            key={cat.name}
            className="relative block rounded-xl border transition-transform hover:scale-105"
          >
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-lg font-bold text-white drop-shadow-md">
              {cat.name}
            </p>
            <div className="aspect-[4/5] h-64 w-full overflow-hidden rounded-xl bg-gray-100">
              <img
                src={cat.image}
                alt={`${cat.name} category`}
                className="h-70 w-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default TopCategories;
