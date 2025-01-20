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
import { PaperCard } from "@/components/paper-card";
import { FileText, Grid2x2Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { usePaperAnalyses } from "@/lib/hooks/use-paper-analyses";
import { PaperAnalysisModal } from "@/components/paper-analysis-modal";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { analyses, isLoading, error } = usePaperAnalyses();
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalysisClick = (analysisId: string) => {
    setSelectedAnalysis(analysisId);
    setIsModalOpen(true);
  };

  const selectedPaper = selectedAnalysis
    ? analyses.find((a) => a.id === selectedAnalysis)
    : null;

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
                    <BreadcrumbPage>Recent analyses</BreadcrumbPage>
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
                      Recent analyses
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      View all your recently analyzed papers.
                    </p>
                  </div>
                  <Button variant="default" asChild>
                    <a href="/dashboard" className="flex items-center gap-2">
                      New analysis
                      <Grid2x2Plus className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center text-destructive">
                    <p>{error}</p>
                  </div>
                ) : analyses.length === 0 ? (
                  <div className="border border-dashed border-muted-foreground/20 rounded-lg py-12">
                   <div className="flex flex-col items-center gap-4 px-4">
                      <div className="bg-muted/50 p-4 rounded-2xl">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">No analyzed papers yet!</p>
                        <p className="text-sm text-muted-foreground">
                          Papers you analyze will appear here.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {analyses.map((analysis) => (
                      <PaperCard
                        key={analysis.id}
                        title={analysis.title}
                        authors={analysis.paperDetails?.authors || []}
                        abstract={analysis.analysis.summary}
                        year={
                          analysis.paperDetails?.year ||
                          new Date(analysis.created_at).getFullYear()
                        }
                        citationCount={
                          analysis.paperDetails?.citationCount || 0
                        }
                        onAIClick={() => handleAnalysisClick(analysis.id)}
                        hasExistingAnalysis={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>

        {selectedPaper && (
          <PaperAnalysisModal
            paper={{
              paperId: selectedPaper.paper_id,
              title: selectedPaper.title,
              authors: selectedPaper.paperDetails?.authors || [],
              citationCount: selectedPaper.paperDetails?.citationCount || 0,
              year:
                selectedPaper.paperDetails?.year ||
                new Date(selectedPaper.created_at).getFullYear(),
              abstract: selectedPaper.paperDetails?.abstract,
            }}
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            analysis={selectedPaper.analysis}
            isLoading={false}
          />
        )}
      </SidebarProvider>
    </ProtectedRoute>
  );
}
