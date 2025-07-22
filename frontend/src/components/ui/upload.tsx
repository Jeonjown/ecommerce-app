// import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDropzone, type FileRejection } from "react-dropzone";

// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ImagePlus } from "lucide-react";
// import { toast } from "sonner";
// import { uploadImage } from "@/api/imageApi";

// const formSchema = z.object({
//   image: z.custom<File>((file) => file instanceof File && file.size > 0, {
//     message: "Please upload a valid image file.",
//   }),
// });

// export const Upload: React.FC = () => {
//   const [preview, setPreview] = React.useState<string | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: "onBlur",
//     defaultValues: {
//       image: undefined,
//     },
//   });

//   const onDrop = React.useCallback(
//     (acceptedFiles: File[], fileRejections: FileRejection[]) => {
//       if (fileRejections.length > 0) {
//         toast.error(
//           "Image must be less than 1MB and of type PNG, JPG, or JPEG.",
//         );
//         form.resetField("image");
//         setPreview(null);
//         return;
//       }

//       const file = acceptedFiles[0];
//       const reader = new FileReader();
//       reader.onload = () => setPreview(reader.result as string);
//       reader.readAsDataURL(file);
//       form.setValue("image", file);
//       form.clearErrors("image");
//     },
//     [form],
//   );

//   const { getRootProps, getInputProps, isDragActive, fileRejections } =
//     useDropzone({
//       onDrop,
//       maxFiles: 1,
//       maxSize: 1_000_000, // 1MB
//       accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
//     });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     toast.success(`Image uploaded successfully 🎉 ${values.image.name}`);
//     uploadImage(values.image);
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="image"
//           render={() => (
//             <FormItem className="mx-auto md:w-1/2">
//               <FormLabel>
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   Upload your image
//                 </h2>
//               </FormLabel>
//               <FormControl>
//                 <div
//                   {...getRootProps()}
//                   className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-dashed p-8 shadow-sm"
//                 >
//                   {preview ? (
//                     <img
//                       src={preview}
//                       alt="Uploaded preview"
//                       className="max-h-[400px] rounded-lg"
//                     />
//                   ) : (
//                     <>
//                       <ImagePlus className="text-muted-foreground size-20" />
//                       <p>
//                         {isDragActive
//                           ? "Drop the image here!"
//                           : "Click or drag an image to upload"}
//                       </p>
//                     </>
//                   )}
//                   <Input {...getInputProps()} type="file" className="hidden" />
//                 </div>
//               </FormControl>
//               <FormMessage />
//               {fileRejections.length > 0 && (
//                 <p className="text-destructive mt-1">
//                   Image must be less than 1MB and of type PNG, JPG, or JPEG.
//                 </p>
//               )}
//             </FormItem>
//           )}
//         />
//         <Button
//           type="submit"
//           disabled={form.formState.isSubmitting}
//           className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
//         >
//           Submit
//         </Button>
//       </form>
//     </Form>
//   );
// };
