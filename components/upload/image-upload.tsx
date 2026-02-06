"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Label } from "../ui/label";

interface ImageUploadProps {
  onUploadSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  label?: string;
}

export function ImageUpload({
  onUploadSuccess,
  onError,
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select an image file";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "File size must be less than 5MB";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setError(null);
    setUploadedUrl(null);

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setUploadedUrl(data.url);
      onUploadSuccess?.(data.url);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setUploadedUrl(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <Label>{label}</Label>
        {!uploadedUrl && (
          <div className="space-y-3">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>

            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />

            {preview && (
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}

            {uploading && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse w-1/3"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}

        {uploadedUrl && (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={uploadedUrl || "/placeholder.svg"}
                alt="Uploaded"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Upload successful!
                </p>
                <p className="text-xs text-green-600/75 dark:text-green-400/75 truncate font-mono">
                  {uploadedUrl}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full bg-transparent"
            >
              Upload Another
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
