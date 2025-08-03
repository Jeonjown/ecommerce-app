import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/ProductSidebar";

const Categories = () => {
  return (
    <SidebarProvider defaultOpen>
      <CategorySidebar />

      <SidebarTrigger className="md:hidden" />
      <div className="w-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default Categories;
