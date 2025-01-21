import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getUserPaperAnalyses } from "@/lib/paper-analysis";
import { PaperAnalysisRecord } from "@/types/paper-analysis";
import { getPaperDetails } from "@/lib/semantic-scholar";
import { Paper } from "@/types/paper";

export interface PaperAnalysisWithDetails extends PaperAnalysisRecord {
  paperDetails: Paper | null;
}

export function usePaperAnalyses() {
  const [analyses, setAnalyses] = useState<PaperAnalysisWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);
        const analysesData = await getUserPaperAnalyses(userId);
        
        // Fetch paper details for each analysis
        const analysesWithDetails = await Promise.all(
          analysesData.map(async (analysis) => {
            try {
              const paperDetails = await getPaperDetails(analysis.paper_id);
              return { ...analysis, paperDetails };
            } catch (err) {
              console.error(`Error fetching paper details for ${analysis.paper_id}:`, err);
              return { ...analysis, paperDetails: null };
            }
          })
        );

        setAnalyses(analysesWithDetails);
      } catch (err) {
        console.error("Error fetching analyses:", err);
        setError("Failed to fetch analyses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [userId]);

  return {
    analyses,
    isLoading,
    error,
  };
} 