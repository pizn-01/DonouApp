import { supabase } from '../config/database';

export class ProjectService {
    /**
     * Create progress update
     */
    async createUpdate(briefId: string, authorId: string, content: string, type: 'MILESTONE' | 'UPDATE' | 'ISSUE') {
        const { data, error } = await supabase
            .from('project_updates')
            .insert({
                brief_id: briefId,
                author_id: authorId,
                content,
                type
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create update: ${error.message}`);
        return data;
    }

    /**
     * Get updates for a project
     */
    async getUpdates(briefId: string) {
        const { data, error } = await supabase
            .from('project_updates')
            .select(`
                *,
                author:author_id ( email )
            `) // Join profile ideally
            .eq('brief_id', briefId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }
}

export const projectService = new ProjectService();
