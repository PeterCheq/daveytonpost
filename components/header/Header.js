"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import CreatePostButton from "../posts/CreatePost";

function Header() {
  const { open, isMobile, toggleSidebar } = useSidebar();
  const { user } = useUser();

  // const isBanned = user?.publicMetadata('IS_BANNED')
  return (
    <header className="flex justify-between border-b  w-full border-gray-200 h-16 shrink-0 items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        {open && !isMobile ? (
          <ChevronLeftIcon className="w-6 h-6" onClick={toggleSidebar} />
        ) : (
          <div className="flex items-center gap-4">
            <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
            <Image
              src="/DAVEYTONPOSTDESKTOP.png"
              alt="logo"
              width={200}
              height={600}
              className="hidden md:block"
            />
            <Image
              src="/DAVEYTONPOSTMOBILE.png"
              alt="logo"
              width={60}
              height={60}
              className="block md:hidden"
            />
          </div>
        )}
      </div>

      <div className="space-x-2 flex items-center">
        <CreatePostButton />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
