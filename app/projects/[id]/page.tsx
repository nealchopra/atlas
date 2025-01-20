"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export default function ProjectPage({ params }: { params: { id: string } }) {
  // This would be replaced with actual data fetching
  const mockPapers = [
    {
      id: "1",
      title: "Deep Learning Approaches in AI",
      authors: ["John Doe", "Jane Smith"],
      date: "2024-03-20",
      tags: ["AI", "Deep Learning", "Neural Networks"],
    },
    {
      id: "2",
      title: "The Future of Quantum Computing",
      authors: ["Alice Johnson"],
      date: "2024-03-18",
      tags: ["Quantum", "Computing"],
    },
  ];

  return (
    <ProtectedRoute>
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
                    <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Project Name</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-8 p-4 pt-16">
            <div className="mx-auto w-full max-w-5xl">
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Project Name
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    View and manage your literature reviews for this project.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPapers.map((paper) => (
                      <TableRow key={paper.id} className="hover:bg-transparent">
                        <TableCell className="font-medium">
                          {paper.title}
                        </TableCell>
                        <TableCell>{paper.authors.join(", ")}</TableCell>
                        <TableCell>
                          {new Date(paper.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {paper.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="secondary" size="sm">
                            View analysis
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
