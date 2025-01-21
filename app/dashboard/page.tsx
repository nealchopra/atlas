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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PaperCard } from "@/components/paper-card";
import { searchPapers } from "@/lib/semantic-scholar";
import { Paper } from "@/types/paper";
import { PaperAnalysisModal } from "@/components/paper-analysis-modal";
import { analyzePaper } from "@/lib/openai";
import { PaperAnalysis } from "@/lib/openai";
import ProtectedRoute from "@/components/protected-route";
import { supabase } from "@/lib/supabase";
import { createPaperAnalysis, getPaperAnalysis } from "@/lib/paper-analysis";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [hasSearched, setHasSearched] = useState(!!searchParams.get("q"));
  const [isLoading, setIsLoading] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // button state
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analyzingPaperId, setAnalyzingPaperId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [analyzedPapers, setAnalyzedPapers] = useState<Set<string>>(new Set());

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    checkUser();
  }, []);

  // Add auto-resize effect
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [searchText]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    // Update URL with search query
    const params = new URLSearchParams();
    params.set("q", searchText.trim());
    router.push(`/dashboard?${params.toString()}`);

    try {
      const results = await searchPapers(searchText);
      setPapers(results);

      // Check which papers have existing analyses
      if (userId) {
        const analyzedSet = new Set<string>();
        await Promise.all(
          results.map(async (paper) => {
            const existingAnalysis = await getPaperAnalysis(
              paper.paperId,
              userId
            );
            if (existingAnalysis) {
              analyzedSet.add(paper.paperId);
            }
          })
        );
        setAnalyzedPapers(analyzedSet);
      }
    } catch (err) {
      setError("Failed to search papers. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add effect to perform search on initial load if query exists
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      handleSearch();
    }
  }, []); // Run only on mount

  const handleAIAnalysis = async (paper: Paper) => {
    if (!userId) return;

    setSelectedPaper(paper);
    setAnalyzingPaperId(paper.paperId);
    setAnalysis(null);
    setError(null);

    try {
      // Check for existing analysis first
      const existingAnalysis = await getPaperAnalysis(paper.paperId, userId);

      if (existingAnalysis) {
        console.log("Found existing analysis:", existingAnalysis);
        setAnalysis(existingAnalysis.analysis);
        setIsAnalysisOpen(true);
      } else {
        // Generate new analysis
        const result = await analyzePaper(paper);

        console.log("Paper data:", {
          paper_id: paper.paperId,
          user_id: userId,
          title: paper.title,
          authors: paper.authors,
          analysis: result,
        });

        // Save to database first
        const savedAnalysis = await createPaperAnalysis({
          paper_id: paper.paperId,
          user_id: userId,
          title: paper.title,
          analysis: result,
          project_id: null,
        });

        if (savedAnalysis) {
          console.log("Successfully saved analysis:", savedAnalysis);
          setAnalysis(result);
          // Update analyzed papers set
          setAnalyzedPapers((prev) => {
            const newSet = new Set(prev);
            newSet.add(paper.paperId);
            return newSet;
          });
          setIsAnalysisOpen(true);
        } else {
          throw new Error("Failed to save analysis to database");
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze paper. Please try again.");
      setIsAnalysisOpen(false);
    } finally {
      setAnalyzingPaperId(null);
    }
  };

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
                    <BreadcrumbPage>Find a paper</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-8 p-4 pt-16">
            {!hasSearched ? (
              //empty state
              <div className="flex flex-col items-center justify-center space-y-6">
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
                      ref={textareaRef}
                      placeholder="e.g. What are the latest developments in quantum computing's impact on cryptography?"
                      className="min-h-[120px] resize-none text-sm pr-12"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (e.shiftKey) {
                            return; // Allow default behavior (new line)
                          }
                          e.preventDefault(); // Prevent default enter behavior
                          handleSearch();
                        }
                      }}
                    />
                    <span className="text-muted-foreground text-xs font-normal bg-muted/50 rounded-md px-2 py-1 absolute bottom-3 left-3">
                      <span className="font-semibold">Enter</span> to search,{" "}
                      <span className="font-semibold">Shift + Enter</span> to
                      add a new line
                    </span>

                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-3 right-3 h-6 w-6 rounded-lg transition-all duration-300"
                      disabled={!searchText.trim() || isLoading}
                      onClick={handleSearch}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              //with search results
              <div className="space-y-8">
                <div className="mx-auto w-full max-w-5xl">
                  <div className="relative">
                    <Input
                      placeholder="Search papers..."
                      className="pr-12"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      disabled={!searchText.trim() || isLoading}
                      onClick={handleSearch}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : (
                  <div className="mx-auto w-full max-w-5xl">
                    <div className="grid grid-cols-2 gap-4">
                      {papers.map((paper) => (
                        <PaperCard
                          key={paper.paperId}
                          title={paper.title}
                          authors={paper.authors}
                          abstract={paper.abstract || ""}
                          year={paper.year || 0}
                          citationCount={paper.citationCount}
                          onAIClick={() => handleAIAnalysis(paper)}
                          isAnalyzing={analyzingPaperId === paper.paperId}
                          hasExistingAnalysis={analyzedPapers.has(
                            paper.paperId
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SidebarInset>

        {selectedPaper && (
          <PaperAnalysisModal
            paper={selectedPaper}
            isOpen={isAnalysisOpen}
            onOpenChange={setIsAnalysisOpen}
            analysis={analysis}
            isLoading={analyzingPaperId === selectedPaper.paperId}
          />
        )}
      </SidebarProvider>
    </ProtectedRoute>
  );
}
