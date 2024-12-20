"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Author } from "@/types/paper";

interface PaperCardProps {
  title: string;
  authors: Author[];
  abstract: string;
  year: number;
  citationCount: number;
  onAIClick: () => void;
  isAnalyzing?: boolean;
}

export function PaperCard({
  title,
  authors,
  abstract,
  year,
  citationCount,
  onAIClick,
  isAnalyzing = false,
}: PaperCardProps) {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {year} • {citationCount} citations
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">{abstract}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <TooltipProvider>
          <div className="flex -space-x-2">
            {authors.slice(0, 3).map((author, index) => (
              <Tooltip key={author.name + index}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {getInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{author.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {authors.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-xs">
                      +{authors.length - 3}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="space-y-1">
                    {authors.slice(3).map((author, index) => (
                      <p key={author.name + index}>{author.name}</p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={onAIClick}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              Analyzing...
              <Loader2 className="ml-1 h-3.5 w-3.5 animate-spin" />
            </>
          ) : (
            <>
              Analyze
              <Sparkles className="ml-1 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
