import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetCategories } from "@/hooks/useGetCategories";
import { Link } from "react-router-dom";

export function CategorySidebar() {
  const { data } = useGetCategories();

  return (
    <Sidebar variant="floating" className="relative w-64 shrink-0">
      <SidebarContent className="border bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl">
            <Link to="/categories" className="flex items-center gap-2">
              Categories
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {data?.categories?.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={`/categories/${category.slug}`}
                      className="flex items-center gap-2"
                    >
                      <span className="text-base font-semibold">
                        {category.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
