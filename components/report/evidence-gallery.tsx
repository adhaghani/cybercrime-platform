"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface EvidenceGalleryProps {
  attachmentPath: string | null;
}

export function EvidenceGallery({ attachmentPath }: EvidenceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachmentPath) return null;

  // Parse the attachment path - it can be a JSON array or a single path
  let imagePaths: string[] = [];
  try {
    imagePaths = JSON.parse(attachmentPath);
    if (!Array.isArray(imagePaths)) {
      imagePaths = [attachmentPath];
    }
  } catch {
    imagePaths = [attachmentPath];
  }

  if (imagePaths.length === 0) return null;

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Evidence Photos ({imagePaths.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePaths.map((path, index) => (
            <Card
              key={index}
              className="cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              onClick={() => setSelectedImage(path)}
            >
              <div className="aspect-square relative">
                <Image
                  src={path}
                  alt={`Evidence ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage}
                alt="Evidence preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
