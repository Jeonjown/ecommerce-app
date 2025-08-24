import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CategorySidebar } from "@/components/CategorySidebar";

const Categories = () => {
  return (
    <SidebarProvider defaultOpen>
      <CategorySidebar />

      <SidebarTrigger className="absolute md:hidden" />
      <div className="w-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default Categories;
