"use client";

import { useState, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "./image-crop-dialog";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userInitials?: string;
  onUploadComplete?: (imagePath: string) => void;
  disabled?: boolean;
  accountId: string;
}

export function ProfilePictureUpload({
  currentImageUrl,
  userInitials = "U",
  onUploadComplete,
  disabled = false,
  accountId,
}: ProfilePictureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCropDialogOpen(true);
    },
    []
  );

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      const fileName = `profile_${accountId}_${Date.now()}.jpg`;
      formData.append("file", croppedBlob, fileName);
      formData.append("accountId", accountId);

      // Upload to server
      const response = await fetch("/api/upload/profile-picture", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Update UI with new image
      setUploadedImageUrl(data.path);
      onUploadComplete?.(data.path);

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={uploadedImageUrl} alt="Profile picture" />
          <AvatarFallback className="text-3xl">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Change Picture"}
      </Button>

      {previewUrl && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={previewUrl}
          onCropComplete={handleCropComplete}
          aspect={1}
          cropShape="round"
        />
      )}
    </div>
  );
}
