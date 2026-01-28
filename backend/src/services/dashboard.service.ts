import { supabase } from '../config/database';

export interface DashboardStats {
    totalBriefs: number;
    activeBriefs: number;
    totalProposals: number;
    pendingProposals: number;
    activeMatches: number;
    unreadMessages: number;
    // Brand-specific
    proposalsReceived?: number;
    // Manufacturer-specific
    proposalsSent?: number;
    matchScore?: number;
}

export interface DashboardActivity {
    id: string;
    type: 'brief_created' | 'proposal_received' | 'proposal_sent' | 'match_found' | 'message_received' | 'proposal_accepted';
    title: string;
    description: string;
    timestamp: string;
    data?: Record<string, unknown>;
}

export class DashboardService {
    /**
     * Get dashboard statistics for a user
     */
    async getStats(userId: string, role: string): Promise<DashboardStats> {
        if (role === 'brand') {
            return this.getBrandStats(userId);
        } else {
            return this.getManufacturerStats(userId);
        }
    }

    /**
     * Get brand-specific dashboard stats
     */
    private async getBrandStats(userId: string): Promise<DashboardStats> {
        // Get brand profile
        const { data: brandProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!brandProfile) {
            return this.getEmptyStats();
        }

        // Get brief counts
        const { count: totalBriefs } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true })
            .eq('brand_id', brandProfile.id)
            .is('deleted_at', null);

        const { count: activeBriefs } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true })
            .eq('brand_id', brandProfile.id)
            .in('status', ['open', 'matched', 'in_progress'])
            .is('deleted_at', null);

        // Get proposals received for brand's briefs
        const { count: proposalsReceived } = await supabase
            .from('proposals')
            .select('*, briefs!inner(*)', { count: 'exact', head: true })
            .eq('briefs.brand_id', brandProfile.id)
            .is('deleted_at', null);

        const { count: pendingProposals } = await supabase
            .from('proposals')
            .select('*, briefs!inner(*)', { count: 'exact', head: true })
            .eq('briefs.brand_id', brandProfile.id)
            .in('status', ['submitted', 'under_review'])
            .is('deleted_at', null);

        // Get matches
        const { count: activeMatches } = await supabase
            .from('brief_matches')
            .select('*, briefs!inner(*)', { count: 'exact', head: true })
            .eq('briefs.brand_id', brandProfile.id);

        // Get unread messages count
        const { count: unreadMessages } = await supabase
            .from('messages')
            .select('*, conversations!inner(*)', { count: 'exact', head: true })
            .eq('conversations.brand_id', brandProfile.id)
            .eq('is_read', false)
            .neq('sender_id', userId);

        return {
            totalBriefs: totalBriefs || 0,
            activeBriefs: activeBriefs || 0,
            totalProposals: proposalsReceived || 0,
            proposalsReceived: proposalsReceived || 0,
            pendingProposals: pendingProposals || 0,
            activeMatches: activeMatches || 0,
            unreadMessages: unreadMessages || 0,
        };
    }

    /**
     * Get manufacturer-specific dashboard stats
     */
    private async getManufacturerStats(userId: string): Promise<DashboardStats> {
        // Get manufacturer profile
        const { data: manufacturerProfile } = await supabase
            .from('manufacturer_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (!manufacturerProfile) {
            return this.getEmptyStats();
        }

        // Get open briefs in marketplace
        const { count: totalBriefs } = await supabase
            .from('briefs')
            .select('*', { count: 'exact', head: true })
            .in('status', ['open', 'matched'])
            .is('deleted_at', null);

        // Get proposals sent
        const { count: proposalsSent } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('manufacturer_id', manufacturerProfile.id)
            .is('deleted_at', null);

        const { count: pendingProposals } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('manufacturer_id', manufacturerProfile.id)
            .in('status', ['submitted', 'under_review'])
            .is('deleted_at', null);

        // Get matches for this manufacturer
        const { count: activeMatches } = await supabase
            .from('brief_matches')
            .select('*', { count: 'exact', head: true })
            .eq('manufacturer_id', manufacturerProfile.id);

        // Get average match score
        const { data: matchScores } = await supabase
            .from('brief_matches')
            .select('match_score')
            .eq('manufacturer_id', manufacturerProfile.id);

        const avgMatchScore = matchScores && matchScores.length > 0
            ? Math.round(matchScores.reduce((sum, m) => sum + (m.match_score || 0), 0) / matchScores.length)
            : 0;

        // Get unread messages
        const { count: unreadMessages } = await supabase
            .from('messages')
            .select('*, conversations!inner(*)', { count: 'exact', head: true })
            .eq('conversations.manufacturer_id', manufacturerProfile.id)
            .eq('is_read', false)
            .neq('sender_id', userId);

        return {
            totalBriefs: totalBriefs || 0,
            activeBriefs: totalBriefs || 0, // For manufacturers, these are marketplace briefs
            totalProposals: proposalsSent || 0,
            proposalsSent: proposalsSent || 0,
            pendingProposals: pendingProposals || 0,
            activeMatches: activeMatches || 0,
            unreadMessages: unreadMessages || 0,
            matchScore: avgMatchScore,
        };
    }

    /**
     * Get recent activity for dashboard
     */
    async getActivity(userId: string, role: string, limit: number = 10): Promise<DashboardActivity[]> {
        const activities: DashboardActivity[] = [];

        if (role === 'brand') {
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (brandProfile) {
                // Get recent briefs
                const { data: recentBriefs } = await supabase
                    .from('briefs')
                    .select('id, title, created_at')
                    .eq('brand_id', brandProfile.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                recentBriefs?.forEach(brief => {
                    activities.push({
                        id: brief.id,
                        type: 'brief_created',
                        title: 'Brief Created',
                        description: brief.title,
                        timestamp: brief.created_at,
                    });
                });

                // Get recent proposals received
                const { data: recentProposals } = await supabase
                    .from('proposals')
                    .select('id, created_at, manufacturer_id, briefs!inner(title, brand_id)')
                    .eq('briefs.brand_id', brandProfile.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                recentProposals?.forEach(proposal => {
                    activities.push({
                        id: proposal.id,
                        type: 'proposal_received',
                        title: 'Proposal Received',
                        description: `New proposal for "${(proposal.briefs as any)?.title}"`,
                        timestamp: proposal.created_at,
                    });
                });
            }
        } else {
            const { data: manufacturerProfile } = await supabase
                .from('manufacturer_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (manufacturerProfile) {
                // Get recent proposals sent
                const { data: recentProposals } = await supabase
                    .from('proposals')
                    .select('id, created_at, briefs(title)')
                    .eq('manufacturer_id', manufacturerProfile.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                recentProposals?.forEach(proposal => {
                    activities.push({
                        id: proposal.id,
                        type: 'proposal_sent',
                        title: 'Proposal Sent',
                        description: `Proposal for "${(proposal.briefs as any)?.title}"`,
                        timestamp: proposal.created_at,
                    });
                });

                // Get recent matches
                const { data: recentMatches } = await supabase
                    .from('brief_matches')
                    .select('id, created_at, match_score, briefs(title)')
                    .eq('manufacturer_id', manufacturerProfile.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                recentMatches?.forEach(match => {
                    activities.push({
                        id: match.id,
                        type: 'match_found',
                        title: 'New Match',
                        description: `Matched with "${(match.briefs as any)?.title}" (${match.match_score}% match)`,
                        timestamp: match.created_at,
                    });
                });
            }
        }

        // Sort by timestamp and limit
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }

    private getEmptyStats(): DashboardStats {
        return {
            totalBriefs: 0,
            activeBriefs: 0,
            totalProposals: 0,
            pendingProposals: 0,
            activeMatches: 0,
            unreadMessages: 0,
        };
    }
}

export default new DashboardService();
