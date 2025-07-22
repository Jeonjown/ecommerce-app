// import { useCallback, useState } from "react";
// import { useDropzone, type FileRejection } from "react-dropzone";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { ImagePlus } from "lucide-react";

// interface Props {
//   onImageSelected: (file: File) => void;
//   currentImageUrl: string;
// }

// export const VariantImageUploader = ({
//   onImageSelected,
//   currentImageUrl,
// }: Props) => {
//   const [preview, setPreview] = useState(currentImageUrl);

//   const onDrop = useCallback(
//     async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
//       console.log("Dropzone accepted files:", acceptedFiles);
//       if (fileRejections.length > 0) {
//         toast.error(
//           "Image must be less than 1MB and of type PNG, JPG, or JPEG.",
//         );
//         return;
//       }

//       const file = acceptedFiles[0];
//       const reader = new FileReader();
//       reader.onload = () => setPreview(reader.result as string);
//       reader.readAsDataURL(file);

//       onImageSelected(file); // just pass the file back to parent
//     },
//     [onImageSelected],
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     maxFiles: 1,
//     maxSize: 1_000_000,
//     accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed p-4 text-center shadow"
//     >
//       {preview ? (
//         <img src={preview} alt="Preview" className="max-h-48 rounded" />
//       ) : (
//         <>
//           <ImagePlus className="text-muted-foreground size-12" />
//           <p>
//             {isDragActive ? "Drop the image here!" : "Click or drag an image"}
//           </p>
//         </>
//       )}
//       <Input {...getInputProps()} type="file" className="hidden" />
//     </div>
//   );
// };
