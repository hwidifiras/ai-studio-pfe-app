/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyticsOverview, TopPost, InboxPerformance } from '@/src/types';

/**
 * Service pour la gestion des données analytiques.
 * Prêt pour l'intégration backend via les endpoints whitelistés.
 */

// Flag pour basculer entre API réelle et Mocks (pilotable via env ou constante)
const USE_MOCKS = true; 

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
 * Client API générique avec gestion d'erreurs
 */
async function apiClient<T>(endpoint: string): Promise<T> {
  if (USE_MOCKS) {
    // Simulation d'un délai réseau léger pour le mode mock
    return new Promise((resolve) => setTimeout(() => {
      if (endpoint.includes('overview')) resolve(FALLBACK_MOCKS.overview as T);
      else if (endpoint.includes('posts/top')) resolve(FALLBACK_MOCKS.topPosts as T);
      else if (endpoint.includes('inbox/performance')) resolve(FALLBACK_MOCKS.performance as T);
    }, 500));
  }

  const response = await fetch(`/api${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * GET /orgs/:orgId/analytics/overview?from=&to=
 */
export async function fetchAnalyticsOverview(orgId: string, from: string, to: string): Promise<AnalyticsOverview> {
  return apiClient<AnalyticsOverview>(`/orgs/${orgId}/analytics/overview?from=${from}&to=${to}`);
}

/**
 * GET /orgs/:orgId/analytics/posts/top?limit=10
 */
export async function fetchTopPosts(orgId: string, limit: number = 10): Promise<TopPost[]> {
  return apiClient<TopPost[]>(`/orgs/${orgId}/analytics/posts/top?limit=${limit}`);
}

/**
 * GET /orgs/:orgId/analytics/inbox/performance?from=&to=
 */
export async function fetchInboxPerformance(orgId: string, from: string, to: string): Promise<InboxPerformance> {
  return apiClient<InboxPerformance>(`/orgs/${orgId}/analytics/inbox/performance?from=${from}&to=${to}`);
}
