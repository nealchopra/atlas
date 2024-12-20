"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [searchText, setSearchText] = useState("");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Find a paper</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
          {/* Search Section */}
          <div className="flex flex-col items-center justify-center space-y-6 pt-16">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                What do you want to find?
              </h1>
              <p className="text-sm text-muted-foreground">
                Paste in a research question, paper abstract, or keywords.
              </p>
            </div>
            <div className="flex w-full max-w-xl flex-col items-center gap-4">
              <div className="relative w-full">
                <Textarea
                  placeholder="e.g. What are the latest developments in quantum computing's impact on cryptography?"
                  className="min-h-[120px] resize-none text-sm pr-12"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-3 right-3 h-6 w-6 rounded-lg transition-all duration-300"
                  disabled={!searchText.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* add results here */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
