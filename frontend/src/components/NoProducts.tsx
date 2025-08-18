import { Box } from "lucide-react";

const NoProducts = () => {
  return (
    <div className="text-muted-foreground flex h-[60vh] flex-col items-center justify-center p-10">
      <Box className="mb-2 h-10 w-10" />
      <p>No products found for this category.</p>
    </div>
  );
};

export default NoProducts;
