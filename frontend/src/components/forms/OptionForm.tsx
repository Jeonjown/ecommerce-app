import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  options: z.array(
    z.object({
      name: z.string().min(1, "Option name is required"),
      values: z.array(z.string().min(1, "Option value is required")),
    }),
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export function OptionForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: [{ name: "", values: [""] }],
    },
  });

  const { control, handleSubmit } = form;

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = (data: FormSchema) => {
    console.log("Form data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {optionFields.map((option, index) => (
          <div key={option.id} className="space-y-4 rounded border p-4">
            <FormField
              control={form.control}
              name={`options.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Render option values as comma-separated values or as separate fields */}
            <FormField
              control={form.control}
              name={`options.${index}.values.0`} // for now, support only 1 value for simplicity
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Red" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove Option
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={() => append({ name: "", values: [""] })}
        >
          Add Option
        </Button>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
