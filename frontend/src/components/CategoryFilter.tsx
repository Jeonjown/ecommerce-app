import { useGetCategories } from "@/hooks/useGetCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CategoryFilter = () => {
  const { data } = useGetCategories();
  return (
    <Select>
      <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
        <SelectValue placeholder="Categories" />
      </SelectTrigger>
      <SelectContent className="text-black">
        {data &&
          data.categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
