import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Paper } from "@/types/paper";
import { PaperAnalysis } from "@/lib/openai";
import { Loader2, Check, Grid2x2Plus, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjects } from "@/lib/hooks/use-projects";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  updatePaperAnalysisProject,
  getPaperAnalysis,
} from "@/lib/paper-analysis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Define tag colors using Tailwind color combinations
const TAG_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
];

interface PaperAnalysisModalProps {
  paper: Paper;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: PaperAnalysis | null;
  isLoading: boolean;
  showAddToProject?: boolean;
  analysisId?: string;
}

type AnalysisSectionKey = Exclude<keyof PaperAnalysis, "tags">;

interface AnalysisSection {
  title: string;
  key: AnalysisSectionKey;
  isList: boolean;
}

const ANALYSIS_SECTIONS: AnalysisSection[] = [
  { title: "Summary", key: "summary", isList: false },
  { title: "Key findings", key: "keyFindings", isList: true },
  { title: "Methodology", key: "methodology", isList: false },
  { title: "Limitations", key: "limitations", isList: true },
  { title: "Future work", key: "futureWork", isList: true },
  { title: "Impact", key: "impact", isList: false },
];

export function PaperAnalysisModal({
  paper,
  isOpen,
  onOpenChange,
  analysis,
  isLoading,
  showAddToProject = true,
  analysisId: providedAnalysisId,
}: PaperAnalysisModalProps) {
  const { projects } = useProjects();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [updatingProject, setUpdatingProject] = useState(false);
  const [fetchedAnalysisId, setFetchedAnalysisId] = useState<string | null>(null);
  const { toast } = useToast();

  // Use the provided analysisId if available, otherwise use the fetched one
  const analysisId = providedAnalysisId || fetchedAnalysisId;

  useEffect(() => {
    const fetchAnalysisId = async () => {
      // Only fetch if we don't have a provided analysisId
      if (providedAnalysisId) {
        setSelectedProjectId(null); // Reset selected project for new analysis
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id || !paper.paperId) return;

      const analysisRecord = await getPaperAnalysis(paper.paperId, user.id);
      if (analysisRecord) {
        setFetchedAnalysisId(analysisRecord.id);
        setSelectedProjectId(analysisRecord.project_id);
      }
    };

    fetchAnalysisId();
  }, [paper.paperId, providedAnalysisId]);

  const renderContent = (
    section: AnalysisSection,
    content: string | string[]
  ) => {
    if (section.isList && Array.isArray(content)) {
      return (
        <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
          {content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm text-muted-foreground">{content as string}</p>;
  };

  const handleProjectClick = async (projectId: string) => {
    if (!analysisId) {
      toast({
        title: "Error",
        description: "Could not find the analysis record. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingProject(true);

      const newProjectId = selectedProjectId === projectId ? null : projectId;

      // Update the database
      const success = await updatePaperAnalysisProject(
        analysisId,
        newProjectId
      );

      if (success) {
        setSelectedProjectId(newProjectId);
        toast({
          title: newProjectId ? "Added to project" : "Removed from project",
          description: `Successfully ${
            newProjectId ? "added to" : "removed from"
          } the selected project.`,
        });
        setIsPopoverOpen(false);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProject(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Analysis</DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 h-[600px]">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analysis ? (
            <div className="space-y-6 pb-6">
              {/* tags */}
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag, index) => {
                  const colorIndex = index % TAG_COLORS.length;
                  const { bg, text } = TAG_COLORS[colorIndex];
                  return (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${bg} ${text}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

              {/* Analysis sections */}
              {ANALYSIS_SECTIONS.map((section) => (
                <div key={section.title} className="rounded-xl bg-muted/50 p-4">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  {renderContent(section, analysis[section.key])}
                </div>
              ))}
            </div>
          ) : null}
        </ScrollArea>

        {/* gradient */}
        <div className="h-16 -mt-20 relative z-10 pointer-events-none bg-gradient-to-t from-background to-transparent" />

        <DialogFooter className="px-6 py-4">
          {showAddToProject !== false && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Add to project <Grid2x2Plus className="h-4 w-4 ml-1" />
                  {selectedProjectId && (
                    <span className="text-indigo-600 text-xs font-normal bg-indigo-500/10 dark:bg-indigo-500/20 rounded-md px-2 py-1">
                      1
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0" align="end">
                <div className="border-b px-3 py-2">
                  <p className="text-sm font-medium text-center">
                    Select a project
                  </p>
                </div>
                <ScrollArea className="h-40">
                  <div className="p-2">
                    {projects?.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-4 px-2">
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">No projects yet</p>
                          <p className="text-xs text-muted-foreground">
                            Create your first project to start organizing your research.
                          </p>
                        </div>
                      </div>
                    ) : (
                      projects?.map((project) => {
                        const isSelected = selectedProjectId === project.id;
                        return (
                          <button
                            key={project.id}
                            onClick={() => handleProjectClick(project.id)}
                            disabled={updatingProject}
                            className={cn(
                              "relative flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors duration-300 hover:bg-accent hover:text-accent-foreground",
                              isSelected && "bg-accent/50"
                            )}
                          >
                            <span>{project.title}</span>
                            {updatingProject &&
                            selectedProjectId === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isSelected ? (
                              <Check className="h-4 w-4" />
                            ) : null}
                          </button>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}