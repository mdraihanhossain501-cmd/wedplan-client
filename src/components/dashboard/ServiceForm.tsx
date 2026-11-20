"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/auth-fetch";
import { uploadImage } from "@/lib/upload";
import { CATEGORIES, MAX_IMAGES } from "@/lib/constants";
import { toastServiceError } from "@/lib/service-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Service } from "@/types";

export default function ServiceForm({
  service,
  onSuccess,
}: {
  service?: Service;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(service);

  const [category, setCategory] = useState(service?.category ?? "");
  const [existing, setExisting] = useState<string[]>(service?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const totalImages = existing.length + files.length;

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0) return;

    if (picked.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Only image files are allowed");
      return;
    }
    if (totalImages + picked.length > MAX_IMAGES) {
      toast.error(`You can add up to ${MAX_IMAGES} images`);
      return;
    }
    setFiles((current) => [...current, ...picked]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const serviceName = String(form.get("serviceName") || "").trim();
    const description = String(form.get("description") || "").trim();
    const location = String(form.get("location") || "").trim();
    const price = Number(form.get("price"));

    if (serviceName.length < 3) {
      toast.error("Service name must be at least 3 characters");
      return;
    }
    if (!category) {
      toast.error("Please choose a category");
      return;
    }
    if (description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!location) {
      toast.error("Please enter the service location");
      return;
    }
    if (totalImages < 1) {
      toast.error("Please add at least one image");
      return;
    }

    setLoading(true);
    try {
      let uploaded: string[] = [];
      try {
        uploaded = await Promise.all(files.map((file) => uploadImage(file)));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Image upload failed"
        );
        return;
      }

      const body = {
        serviceName,
        category,
        description,
        price,
        location,
        images: [...existing, ...uploaded],
      };

      const result = await authFetch<{ message: string }>(
        isEdit ? `/api/services/${service!._id}` : "/api/services",
        { method: isEdit ? "PUT" : "POST", body: JSON.stringify(body) }
      );

      toast.success(result.message);
      onSuccess();
    } catch (error) {
      toastServiceError(error, () => router.push("/dashboard/vendor/subscription"));
    } finally {
      setLoading(false);
    }
  }

  const thumbs = [
    ...existing.map((src, index) => ({
      src,
      remove: () => setExisting((list) => list.filter((_, i) => i !== index)),
    })),
    ...previews.map((src, index) => ({
      src,
      remove: () => setFiles((list) => list.filter((_, i) => i !== index)),
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service name</Label>
        <Input
          id="serviceName"
          name="serviceName"
          defaultValue={service?.serviceName}
          placeholder="e.g. Golden Hour Photography"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Service category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={service?.description}
          placeholder="Describe what is included, your experience and how you work"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="1"
            step="any"
            defaultValue={service?.price}
            placeholder="45000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={service?.location}
            placeholder="e.g. Dhaka"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Service images ({totalImages}/{MAX_IMAGES})
        </Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {thumbs.map((thumb, index) => (
            <div key={`${thumb.src}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb.src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={thumb.remove}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {totalImages < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:bg-muted"
            >
              <ImagePlus className="size-5" />
              Add image
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {loading
          ? "Saving..."
          : isEdit
            ? "Save changes"
            : "Submit for review"}
      </Button>
    </form>
  );
}