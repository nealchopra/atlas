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
import useSWR from "swr";
import { getAuthHeader } from "@/lib/hooks/use-projects";

interface PaperAnalysis {
  id: string;
  title: string;
  analysis: {
    authors?: string[];
    tags?: string[];
  };
  created_at: string;
}

interface ProjectWithAnalyses {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  paper_analyses: PaperAnalysis[];
}

const fetcher = async (url: string) => {
  const authHeader = getAuthHeader();
  if (!authHeader) throw new Error("No auth token");

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
    },
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  
  return res.json();
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project, error } = useSWR<ProjectWithAnalyses>(
    `/api/projects/${params.id}`,
    fetcher
  );

  const isLoading = !project && !error;

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
                    <BreadcrumbPage>{project?.title || "Loading..."}</BreadcrumbPage>
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
                    {project?.title || "Loading..."}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {project?.description || "View and manage your literature reviews for this project."}
                  </p>
                </div>
                {isLoading ? (
                  <p>Loading analyses...</p>
                ) : error ? (
                  <p>Error loading project data</p>
                ) : project?.paper_analyses?.length === 0 ? (
                  <p>No analyses yet. Add your first paper analysis to get started.</p>
                ) : (
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
                      {project?.paper_analyses.map((paper) => (
                        <TableRow key={paper.id}>
                          <TableCell className="font-medium">
                            {paper.title}
                          </TableCell>
                          <TableCell>
                            {paper.analysis.authors?.join(", ") || "N/A"}
                          </TableCell>
                          <TableCell>
                            {new Date(paper.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {paper.analysis.tags?.map((tag) => (
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
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
