"use client";

import { useUser } from "@clerk/nextjs";
import { ImageIcon, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCommunity } from "@/actions/createCommunity";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(20),
  slug: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase, use hyphens instead of spaces, and contain only letters, numbers, and hyphens.",
    }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(200, { message: "Description must be at most 200 characters." }),
  photo: z.any().optional(),
});

function CreateCommunityButton() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      photo: undefined,
    },
  });

  const nameValue = form.watch("name");
  const photoValue = form.watch("photo");

  useEffect(() => {
    if (nameValue) {
      const generatedSlug = nameValue
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .slice(0, 20);
      form.setValue("slug", generatedSlug);
    } else {
      form.setValue("slug", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  useEffect(() => {
    if (photoValue instanceof File) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(photoValue);
    } else {
      setImagePreview(null);
    }
  }, [photoValue]);

  const handleRemoveImage = () => {
    form.setValue("photo", undefined);
    setImagePreview(null);
  };

  const isSubmitting = form.formState.isSubmitting;
  const onSubmit = async (values) => {
    try {
      const result = await createCommunity(values);
      if (result.slug) {
        router.push(`/community/${result.slug}`);
      }
    } catch (error) {
      console.log("Failed to create community:", error);
      console.error("Failed to create community:", error);
    }
    console.log(values);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!user}
        className="w-full p-2 pl-5 flex items-center justify-center bg-gradient-to-b  from-yellow-500  to-amber-800  font-semibold gap-2 text-center rounded-md cursor-pointer bg-black text-white hover:bg-black transition-all duration-200 disabled:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />{" "}
        {!user ? "SignIn to Crate Community" : "Create a Community"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
          <DialogDescription>
            Create a community to share ideas and get feedback.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Community" {...field} />
                    </FormControl>
                    <FormDescription>
                      Display Name for your community
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Slug (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="my-community" {...field} />
                    </FormControl>
                    <FormDescription>
                      A custom Url friendly name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your community (10-200 characters)..."
                        minLength={10}
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a short description about your community. This will
                      be visible to everyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a photo for your community (JPG, PNG, GIF, etc.).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-2 relative w-full h-32 rounded-md border border-dashed border-gray-400 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityButton;
