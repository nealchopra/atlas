import { PaperAnalysis } from "@/lib/openai";

export interface PaperAnalysisRecord {
    id: string;
    paper_id: string;
    user_id: string;
    analysis: PaperAnalysis;
    created_at: string;
    updated_at: string;
}

export type CreatePaperAnalysis = Omit<PaperAnalysisRecord, 'id' | 'created_at' | 'updated_at'>; 