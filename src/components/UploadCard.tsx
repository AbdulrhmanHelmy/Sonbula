"use client";

import { useState } from "react";

interface UploadCardProps {
  title?: string;
  description?: string;
  disabled?: boolean;
}

export default function UploadCard({
  title = "Upload Plant Image",
  description = "Drag and drop or click to select an image",
  disabled = false
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
        disabled
          ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
          : isDragging
          ? "border-green-500 bg-green-50"
          : "border-green-300 bg-white hover:border-green-400 hover:bg-green-50 cursor-pointer"
      }`}
    >
      <input
        type="file"
        onChange={handleFileInput}
        disabled={disabled}
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      {!preview ? (
        <div className="text-center space-y-3">
          <div className="flex justify-center text-5xl">📸</div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WebP</p>
        </div>
      ) : (
        <div className="space-y-3">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => setPreview(null)}
            disabled={disabled}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Change Image
          </button>
        </div>
      )}
    </div>
  );
}
