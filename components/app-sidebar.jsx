import * as React from "react"
import { FlameIcon, HomeIcon, Minus, Plus, TrendingUpIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { getSubreddit } from "@/sanity/lib/subredddit/getSubreddit"
import CreateCommunityButton from "./header/CreateCommunityButton"

// This is sample data.


export async function AppSidebar({
  ...props
}) {

  const subreddits = await getSubreddit()

  const data = {
    navMain: [

      {
        title: "Communities",
        url: "#",
        items: subreddits?.map(subreddit => ({
          title: subreddit.title,
          url: `/community/${subreddit.slug}`
        }))
      },
    ],
  }


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src='/DAVEYTONPOSTDESKTOP.png' className="w-full"
                  width={200}
                  alt="main-desktop-logo"
                  height={600} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem >

              <SidebarMenuButton asChild className='p-5'>
                <CreateCommunityButton />
              </SidebarMenuButton>
              <SidebarMenuButton asChild className='p-5'>
                <Link href='/'>
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className='p-5'>
                <Link href='/popular'>
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  Popular
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className='p-5'>
                <Link href='/'>
                  <FlameIcon className="w-4 h-4 mr-2" />
                  Hot/Controlversial
                </Link>
              </SidebarMenuButton>

            </SidebarMenuItem>
          </SidebarMenu>

        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible key={item.title} defaultOpen={index === 1} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={item.isActive}>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
