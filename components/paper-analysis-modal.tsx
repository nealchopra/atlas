import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Paper } from "@/types/paper";
import { PaperAnalysis } from "@/lib/openai";
import { Loader2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
}: PaperAnalysisModalProps) {
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

        <DialogFooter className="px-6 py-4">
          <Button variant="outline" className="gap-2">
            Add to Notion
            <Image
              src="/notion.svg"
              alt="Notion"
              width={16}
              height={16}
              className="opacity-70"
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
