"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import createPost from "@/actions/createPost";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  body: z.string().min(10),
  imagePreview: z.any().optional(),
});

function CreatePostForm({ subreddit }) {
  const [imagePreview, setImagePreview] = useState(undefined);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      imagePreview: undefined,
    },
  });

  const photoValue = form.watch("imagePreview");

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

  const isSubmitting = form.formState.isSubmitting;

  const removeImage = () => {
    form.setValue("imagePreview", undefined);
    setImagePreview(null);
  };
  const onSubmit = (values, e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await createPost(values, subreddit);
        if (result.success) {
          console.log("Post successfully created");
          form.reset();
          setImagePreview(null);
          router.push(`/community?subreddit=${subreddit}`);
        }

        console.error("Error creating post:", error);
      } catch (error) {
        console.log("Error: Create Post Failed", error);
        console.error("Error: Failed to create Post", error);
        form.reset();
      }
    });
  };
  if (!subreddit) {
    return (
      <div className="text-center p-4">
        <p>Please select a community first</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title of your post" {...field} />
                </FormControl>
                <FormDescription>Post Title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add your post here."
                    minLength={10}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Post Body</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagePreview"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image (optional)</FormLabel>
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
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {imagePreview ? (
            <div className="relative w-full h-64 mx-auto">
              <Image
                src={imagePreview}
                alt="Post preview"
                fill
                className="object-contain"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 flex items-center justify-center"
                onClick={removeImage}
              >
                X
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">Click to Upload an image</p>
            </div>
          )}
          <Button
            type="submit"
            className={"w-full "}
            disabled={isSubmitting || isPending}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreatePostForm;
