"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface ImageUploadProps {
  name: string;
  label: string;
  required: boolean;
}

export function ImageUpload({ name, label, required }: ImageUploadProps) {
  const {
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const currentFile = watch(name);

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 400;
          canvas.height = 400;
          ctx?.drawImage(img, 0, 0, 400, 400);

          const mimeType = file.type;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                const resizedFile = new File([blob], newName, {
                  type: "image/jpeg",
                });

                resolve(resizedFile);
              }
            },
            mimeType,
            0.8,
          );
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resized = await resizeImage(file);
      setValue(name, resized);

      if (preview) URL.revokeObjectURL(preview);

      const objectUrl = URL.createObjectURL(resized);
      setPreview(objectUrl);

      trigger(name);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="font-semibold">
        {label}
        {required && <span className="text-red-500">*</span>}{" "}
      </label>
      <div
        className="relative w-40 h-40 group cursor-pointer"
        onClick={() => document.getElementById(name)?.click()}
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-indigo-500 transition-all">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-xs text-center px-2">
              Clique para enviar
            </span>
          )}
        </div>
      </div>

      <input
        id={name}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {errors[name] && (
        <span className="text-rose-500 md:text-sm 2xl:text-base mb-4">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
