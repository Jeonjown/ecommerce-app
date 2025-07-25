// src/components/ui/UploadImageField.tsx
import React from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UploadImageFieldProps {
  name: "image_file";
  label?: string;
}

export const UploadImageField: React.FC<UploadImageFieldProps> = ({
  name,
  label = "Variant Image",
}) => {
  const { control, setValue, resetField, clearErrors } = useFormContext();
  const [preview, setPreview] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        toast.error("Image must be <1MB and PNG/JPG/JPEG");
        resetField(name);
        setPreview(null);
        return;
      }
      const file = accepted[0];
      setValue(name, file, { shouldValidate: true });
      clearErrors(name);

      // local preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [name, setValue, resetField, clearErrors],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1_000_000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              {...getRootProps()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-md"
                />
              ) : (
                <>
                  <ImagePlus className="h-6 w-6" />
                  <p>
                    {isDragActive
                      ? "Drop image here"
                      : "Click or drag image to select"}
                  </p>
                </>
              )}
              <Input {...getInputProps()} type="file" className="hidden" />
            </div>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
