/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyticsOverview, TopPost, InboxPerformance } from '@/src/types';

/**
 * Service pour la gestion des données analytiques.
 * Prêt pour l'intégration backend via les endpoints whitelistés.
 */

/**
 * Service pour la gestion des données analytiques.
 * Prêt pour l'intégration backend via les endpoints whitelistés.
 */

// Fallback mocks structured according to API contract
const FALLBACK_MOCKS = {
  overview: {
    impressions: 125430,
    impressionsChange: 12.5,
    engagementRate: 4.8,
    engagementRateChange: 0.5,
    responseTime: 24,
    responseTimeChange: -15,
    sentiment: { positive: 65, neutral: 25, negative: 10 }
  },
  topPosts: [
    {
      id: '1',
      platform: 'facebook' as const,
      content: 'Découvrez notre nouvelle collection Printemps 2026 ! 🌸 #SmartSocial #Mode',
      author: 'Jean Dupont',
      date: '2026-04-10',
      engagement: 1240,
      impressions: 15000,
      engagementRate: 8.2,
      status: 'published' as const,
      imageUrl: 'https://picsum.photos/seed/post1/400/300'
    },
    {
      id: '2',
      platform: 'linkedin' as const,
      content: 'Pourquoi l\'IA va transformer la gestion des réseaux sociaux pour les PME en 2026.',
      author: 'Marie Curie',
      date: '2026-04-12',
      engagement: 850,
      impressions: 12000,
      engagementRate: 7.1,
      status: 'published' as const
    }
  ],
  performance: {
    avgResponseTime: 24,
    resolvedCount: 450,
    escalatedCount: 12,
    volumeByDay: [
      { date: '01/04', count: 45 },
      { date: '02/04', count: 52 },
      { date: '03/04', count: 38 },
      { date: '04/04', count: 65 },
      { date: '05/04', count: 48 },
      { date: '06/04', count: 55 },
      { date: '07/04', count: 60 },
    ]
  }
};

/**
 * GET /orgs/:orgId/analytics/overview?from=&to=
 */
export async function fetchAnalyticsOverview(orgId: string, from: string, to: string): Promise<AnalyticsOverview> {
  try {
    // En production, décommenter la ligne suivante:
    // const response = await fetch(`/api/orgs/${orgId}/analytics/overview?from=${from}&to=${to}`);
    // return await response.json();
    
    // Fallback Mock (Simulation réseau légère)
    return await Promise.resolve(FALLBACK_MOCKS.overview);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
}

/**
 * GET /orgs/:orgId/analytics/posts/top?limit=10
 */
export async function fetchTopPosts(orgId: string, limit: number = 10): Promise<TopPost[]> {
  try {
    // En production, décommenter la ligne suivante:
    // const response = await fetch(`/api/orgs/${orgId}/analytics/posts/top?limit=${limit}`);
    // return await response.json();
    
    return await Promise.resolve(FALLBACK_MOCKS.topPosts);
  } catch (error) {
    console.error('Error fetching top posts:', error);
    throw error;
  }
}

/**
 * GET /orgs/:orgId/analytics/inbox/performance?from=&to=
 */
export async function fetchInboxPerformance(orgId: string, from: string, to: string): Promise<InboxPerformance> {
  try {
    // En production, décommenter la ligne suivante:
    // const response = await fetch(`/api/orgs/${orgId}/analytics/inbox/performance?from=${from}&to=${to}`);
    // return await response.json();
    
    return await Promise.resolve(FALLBACK_MOCKS.performance);
  } catch (error) {
    console.error('Error fetching inbox performance:', error);
    throw error;
  }
}
