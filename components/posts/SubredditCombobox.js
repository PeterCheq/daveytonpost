"use client";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function SubredditCombobox({ subreddits }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const handleSelect = () => {
    setValue(currentValue);
    setOpen(false);
    if (value) {
      router.push(`/create-post?subreddit=${currentValue}`);
    } else {
      router.push("create-post");
    }
  };

  console.log("subreddits", subreddits);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full flex items-center justify-between cursor-pointer bg-gradient-to-b  from-yellow-500  to-amber-800 p-2 text-white font-semibold">
        {value
          ? subreddits.find((subreddit) => subreddit.title === value).title ||
            "Select a community"
          : "Create a community"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-6">
        <Command className={"W-fulll"}>
          <CommandInput placeholder="Search Community..." />
          <CommandList>
            <CommandEmpty>No Community found.</CommandEmpty>
            <CommandGroup>
              {subreddits.map((subreddit) => (
                <CommandItem
                  key={subreddit._id}
                  value={subreddit.title ?? ""}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subreddit.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subreddit.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SubredditCombobox;
