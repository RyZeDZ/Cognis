// frontend/app/profile/components/ProfileImageUploader.tsx
"use client";

import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Cropper, { type Area } from "react-easy-crop";
import { UploadCloud, X as CloseIcon, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

// A helper function to create a cropped image from the canvas
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png"); // You can change format to 'image/jpeg'
  });
}

// The props our component will accept
type ProfileImageUploaderProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (newImageUrl: string) => void;
};

export default function ProfileImageUploader({
  isOpen,
  onClose,
  onUploadComplete,
}: ProfileImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsLoading(true);
    setError(null);
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageBlob) throw new Error("Could not crop image.");

      const formData = new FormData();
      formData.append("file", croppedImageBlob, "profile.png");

      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/utils/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Upload failed.");

      // Call the callback with the new URL
      onUploadComplete(data.imageUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-card-bg rounded-lg shadow-lg z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Update Profile Picture
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-muted-accent hover:bg-border"
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </Dialog.Close>

          <div className="space-y-4">
            {imageSrc ? (
              <div className="relative h-64 bg-primary rounded-md">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // For a square/circular crop
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
            ) : (
              <label
                htmlFor="pfp-upload"
                className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-border"
              >
                <UploadCloud size={48} className="text-muted-accent mb-2" />
                <p className="text-muted-accent">Click to select an image</p>
                <input
                  id="pfp-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            )}

            {imageSrc && (
              <div>
                <label className="text-sm text-muted-accent">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-border">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleUpload}
                disabled={!imageSrc || isLoading}
                className="px-4 py-2 flex items-center text-sm font-semibold text-primary bg-accent rounded-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />{" "}
                    Uploading...
                  </>
                ) : (
                  "Upload & Save"
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
