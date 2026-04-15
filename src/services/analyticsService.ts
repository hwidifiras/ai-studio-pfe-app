/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyticsOverview, TopPost, InboxPerformance } from '@/src/types';

/**
 * Service pour la gestion des données analytiques.
 * Prêt pour l'intégration backend via les endpoints whitelistés.
 */

// Mock data structured as per expected backend payloads
const MOCK_OVERVIEW: AnalyticsOverview = {
  impressions: 125430,
  impressionsChange: 12.5,
  engagementRate: 4.8,
  engagementRateChange: 0.5,
  responseTime: 24,
  responseTimeChange: -15,
  sentiment: {
    positive: 65,
    neutral: 25,
    negative: 10
  }
};

const MOCK_TOP_POSTS: TopPost[] = [
  {
    id: '1',
    platform: 'facebook',
    content: 'Découvrez notre nouvelle collection Printemps 2026 ! 🌸 #SmartSocial #Mode',
    author: 'Jean Dupont',
    date: '2026-04-10',
    engagement: 1240,
    impressions: 15000,
    engagementRate: 8.2,
    status: 'published',
    imageUrl: 'https://picsum.photos/seed/post1/400/300'
  },
  {
    id: '2',
    platform: 'linkedin',
    content: 'Pourquoi l\'IA va transformer la gestion des réseaux sociaux pour les PME en 2026.',
    author: 'Marie Curie',
    date: '2026-04-12',
    engagement: 850,
    impressions: 12000,
    engagementRate: 7.1,
    status: 'published'
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Merci à tous nos clients de Casablanca pour leur confiance ! 🇲🇦',
    author: 'Jean Dupont',
    date: '2026-04-08',
    engagement: 2100,
    impressions: 25000,
    engagementRate: 8.4,
    status: 'published',
    imageUrl: 'https://picsum.photos/seed/post3/400/300'
  }
];

const MOCK_INBOX_PERF: InboxPerformance = {
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
};

/**
 * GET /orgs/:orgId/analytics/overview?from=&to=
 */
export async function fetchAnalyticsOverview(orgId: string, from: string, to: string): Promise<AnalyticsOverview> {
  // Simulation d'appel API
  console.log(`Fetching overview for org ${orgId} from ${from} to ${to}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_OVERVIEW), 800);
  });
}

/**
 * GET /orgs/:orgId/analytics/posts/top?limit=10
 */
export async function fetchTopPosts(orgId: string, limit: number = 10): Promise<TopPost[]> {
  // Simulation d'appel API
  console.log(`Fetching top posts for org ${orgId} with limit ${limit}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TOP_POSTS), 800);
  });
}

/**
 * GET /orgs/:orgId/analytics/inbox/performance?from=&to=
 */
export async function fetchInboxPerformance(orgId: string, from: string, to: string): Promise<InboxPerformance> {
  // Simulation d'appel API
  console.log(`Fetching inbox performance for org ${orgId} from ${from} to ${to}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_INBOX_PERF), 800);
  });
}
