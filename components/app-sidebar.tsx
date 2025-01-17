"use client";

import * as React from "react";
import {
  BookOpen,
  Command,
  Frame,
  Globe,
  PieChart,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const data = {
  navMain: [
    {
      title: "Find a paper",
      url: "#",
      icon: Command,
      isActive: true,
      items: [
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Recent searches",
          url: "#",
        },
        {
          title: "Advanced search",
          url: "#",
        },
      ],
    },
    {
      title: "My library",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Saved papers",
          url: "#",
        },
        {
          title: "Collections",
          url: "#",
        },
        {
          title: "Reading list",
          url: "#",
        },
      ],
    },
    {
      title: "Research tools",
      url: "#",
      icon: Frame,
      items: [
        {
          title: "Citation manager",
          url: "#",
        },
        {
          title: "PDF reader",
          url: "#",
        },
        {
          title: "Note taking",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  projects: [
    {
      name: "Recent papers",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Cited papers",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = session.user;
        setUser({
          name: userData.user_metadata.full_name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          avatar: userData.user_metadata.avatar_url || '/avatars/default.jpg'
        });
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = session.user;
        setUser({
          name: userData.user_metadata.full_name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          avatar: userData.user_metadata.avatar_url || '/avatars/default.jpg'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Globe className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Atlas</span>
                  <span className="truncate text-xs">Research Assistant</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
