import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Filters = () => {
  return (
    <div className="flex space-x-4">
      {/* <CategoryFilter /> */}
      <Select>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Variants" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="A-Z" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
