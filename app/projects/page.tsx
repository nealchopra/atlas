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
import ProtectedRoute from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MoreVertical,
  GraduationCap,
  Code,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { useProjects } from "@/lib/hooks/use-projects";
import type { Project } from "@/lib/hooks/use-projects";
import Link from "next/link";

export default function Page() {
  const { projects, isLoading, deleteProject } = useProjects();

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
                    <BreadcrumbPage>Projects</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-8 p-4 pt-16">
            <div className="mx-auto w-full max-w-5xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Projects
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Create and manage your research projects.
                    </p>
                  </div>
                  <CreateProjectDialog />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <p>Loading projects...</p>
                  ) : projects?.length === 0 ? (
                    <p>No projects yet. Create your first project to get started.</p>
                  ) : (
                    projects?.map((project) => (
                      <Card key={project.id} className="flex flex-col p-4">
                        <div className="flex items-start justify-between">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`}>
                                  View project
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteProject(project.id)}
                              >
                                Delete project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold">{project.title}</h3>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.description}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Last updated{" "}
                            {new Date(project.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
