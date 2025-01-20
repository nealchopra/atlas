import { supabase } from "./supabase";
import { CreatePaperAnalysis, PaperAnalysisRecord } from "@/types/paper-analysis";

export async function getPaperAnalysis(paperId: string, userId: string): Promise<PaperAnalysisRecord | null> {
    try {
        const { data, error } = await supabase
            .from('paper_analyses')
            .select('*')
            .eq('paper_id', paperId)
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching paper analysis:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return null;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in getPaperAnalysis:', err);
        return null;
    }
}

export async function createPaperAnalysis(analysis: CreatePaperAnalysis): Promise<PaperAnalysisRecord | null> {
    try {
        console.log('Attempting to create paper analysis:', analysis);
        
        const { data, error } = await supabase
            .from('paper_analyses')
            .insert(analysis)
            .select()
            .single();

        if (error) {
            console.error('Error creating paper analysis:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return null;
        }

        console.log('Successfully created paper analysis:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error in createPaperAnalysis:', err);
        return null;
    }
}

export async function getUserPaperAnalyses(userId: string): Promise<PaperAnalysisRecord[]> {
    try {
        const { data, error } = await supabase
            .from('paper_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user paper analyses:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error in getUserPaperAnalyses:', err);
        return [];
    }
}

export async function updatePaperAnalysisProject(analysisId: string, projectId: string | null): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('paper_analyses')
            .update({ project_id: projectId })
            .eq('id', analysisId);

        if (error) {
            console.error('Error updating paper analysis project:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error in updatePaperAnalysisProject:', err);
        return false;
    }
} 