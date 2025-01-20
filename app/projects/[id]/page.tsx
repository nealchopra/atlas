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
import { Eye, Trash2, Loader2, FileText } from "lucide-react";
import useSWR from "swr";
import { getAuthHeader } from "@/lib/hooks/use-projects";
import { useState } from "react";
import { PaperAnalysisModal } from "@/components/paper-analysis-modal";
import { Paper } from "@/types/paper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updatePaperAnalysisProject } from "@/lib/paper-analysis";
import { useToast } from "@/hooks/use-toast";

interface PaperAnalysis {
  id: string;
  title: string;
  analysis: {
    tags: string[];
    summary: string;
    keyFindings: string[];
    methodology: string;
    limitations: string[];
    futureWork: string[];
    impact: string;
    authors?: string[];
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
  const {
    data: project,
    error,
    mutate,
  } = useSWR<ProjectWithAnalyses>(`/api/projects/${params.id}`, fetcher);

  const [selectedPaper, setSelectedPaper] = useState<PaperAnalysis | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<PaperAnalysis | null>(
    null
  );
  const { toast } = useToast();

  const isLoading = !project && !error;

  const handleViewAnalysis = (paper: PaperAnalysis) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (paper: PaperAnalysis) => {
    setPaperToDelete(paper);
  };

  const handleConfirmDelete = async () => {
    if (!paperToDelete) return;

    try {
      const success = await updatePaperAnalysisProject(paperToDelete.id, null);

      if (success) {
        // Update local data
        mutate({
          ...project!,
          paper_analyses: project!.paper_analyses.filter(
            (p) => p.id !== paperToDelete.id
          ),
        });

        toast({
          title: "Analysis removed",
          description: "Successfully removed the analysis from this project.",
        });
      } else {
        throw new Error("Failed to remove analysis");
      }
    } catch (error) {
      console.error("Error removing analysis:", error);
      toast({
        title: "Error",
        description: "Failed to remove the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaperToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    );
  }

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
                    <BreadcrumbPage>
                      {project?.title || "Loading..."}
                    </BreadcrumbPage>
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
                    {project?.description ||
                      "View and manage your literature reviews for this project."}
                  </p>
                </div>
                {error ? (
                  <p>Error loading project data</p>
                ) : project?.paper_analyses?.length === 0 ? (
                  <div className="border border-dashed border-muted-foreground/20 rounded-lg py-12">
                    <div className="flex flex-col items-center gap-4 px-4">
                      <div className="bg-muted/50 p-4 rounded-2xl">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          No analyses in this project yet!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add your first paper analysis to start organizing your
                          research.
                        </p>
                      </div>
                    </div>
                  </div>
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
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View analysis"
                                onClick={() => handleViewAnalysis(paper)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete analysis"
                                className="text-destructive"
                                onClick={() => handleDeleteClick(paper)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
      {selectedPaper && (
        <PaperAnalysisModal
          paper={{
            paperId: selectedPaper.id,
            title: selectedPaper.title,
            authors:
              selectedPaper.analysis.authors?.map((name) => ({ name })) || [],
            citationCount: 0,
            year: new Date(selectedPaper.created_at).getFullYear(),
          }}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          analysis={selectedPaper.analysis}
          isLoading={false}
          showAddToProject={false}
        />
      )}
      <AlertDialog
        open={!!paperToDelete}
        onOpenChange={(open: boolean) => !open && setPaperToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove analysis from project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this analysis from your project?
              The analysis will still be available in your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
