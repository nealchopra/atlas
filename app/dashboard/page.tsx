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
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { PaperCard } from "@/components/paper-card";

// Example data for demonstration
const examplePapers = [
  {
    title: "Attention Is All You Need",
    authors: [
      { name: "Ashish Vaswani" },
      { name: "Noam Shazeer" },
      { name: "Niki Parmar" },
      { name: "Jakob Uszkoreit" },
      { name: "Llion Jones" },
      { name: "Aidan N. Gomez" },
      { name: "Lukasz Kaiser" },
      { name: "Illia Polosukhin" },
    ],
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    year: 2017,
    citationCount: 89000,
  },
  {
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: [
      { name: "Jacob Devlin" },
      { name: "Ming-Wei Chang" },
      { name: "Kenton Lee" },
      { name: "Kristina Toutanova" },
    ],
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    year: 2018,
    citationCount: 75000,
  },
  {
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: [
      { name: "Tom B. Brown" },
      { name: "Benjamin Mann" },
      { name: "Nick Ryder" },
      { name: "Melanie Subbiah" },
    ],
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.",
    year: 2020,
    citationCount: 45000,
  },
  {
    title: "Deep Residual Learning for Image Recognition",
    authors: [
      { name: "Kaiming He" },
      { name: "Xiangyu Zhang" },
      { name: "Shaoqing Ren" },
      { name: "Jian Sun" },
    ],
    abstract:
      "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.",
    year: 2016,
    citationCount: 120000,
  },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      setHasSearched(true);
    }
  };

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
                    placeholder="e.g. What are the latest developments in quantum computing's impact on cryptography?"
                    className="min-h-[120px] resize-none text-sm pr-12"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        handleSearch();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-3 right-3 h-6 w-6 rounded-lg transition-all duration-300"
                    disabled={!searchText.trim()}
                    onClick={handleSearch}
                  >
                    <ArrowUp className="h-4 w-4" />
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
                    disabled={!searchText.trim()}
                    onClick={handleSearch}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mx-auto w-full max-w-5xl">
                <div className="grid grid-cols-2 gap-4">
                  {examplePapers.map((paper) => (
                    <PaperCard
                      key={paper.title}
                      {...paper}
                      onAIClick={() => {
                        console.log("AI analysis clicked for:", paper.title);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
