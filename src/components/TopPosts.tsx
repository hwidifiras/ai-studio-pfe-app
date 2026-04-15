/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Linkedin, Instagram, Eye, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Post } from '@/src/types';

const topPosts: Post[] = [
  {
    id: '1',
    platform: 'facebook',
    content: 'Découvrez notre nouveau catalogue été ! ☀️ #pme #ecommerce',
    author: 'SmartSocial PME',
    date: '12 Avril',
    engagement: 1240,
    impressions: 15400,
    status: 'published'
  },
  {
    id: '2',
    platform: 'linkedin',
    content: 'Pourquoi l\'IA va révolutionner votre service client en 2026.',
    author: 'SmartSocial PME',
    date: '10 Avril',
    engagement: 850,
    impressions: 8200,
    status: 'published'
  },
  {
    id: '3',
    platform: 'instagram',
    content: 'Bientôt : L\'intégration Instagram arrive !',
    author: 'SmartSocial PME',
    date: 'Prochainement',
    engagement: 0,
    impressions: 0,
    status: 'draft'
  }
];

export default function TopPosts() {
  return (
    <Card className="border-slate-200 shadow-none bg-white rounded-xl col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-base font-bold text-slate-800">Top 5 Publications</CardTitle>
        <button className="text-slate-500 hover:text-slate-600 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contenu</th>
                <th className="text-left pb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Canal</th>
                <th className="text-right pb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Impressions</th>
                <th className="text-right pb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 line-clamp-1">{post.content}</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{post.date}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    {post.platform === 'instagram' ? (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] uppercase font-bold tracking-tighter">
                        Bientôt
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        {post.platform === 'facebook' ? <Facebook size={14} className="text-blue-600" /> : <Linkedin size={14} className="text-blue-700" />}
                        <span className="text-xs font-bold text-slate-500 capitalize">{post.platform}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-600">
                      <Eye size={12} className="text-slate-400" />
                      <span className="text-xs font-bold">{post.impressions.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Heart size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">{post.engagement}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MessageCircle size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">12</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
