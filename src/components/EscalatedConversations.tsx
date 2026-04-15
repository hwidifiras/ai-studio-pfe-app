/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Linkedin, AlertCircle, MessageSquare } from 'lucide-react';
import { Conversation } from '@/src/types';

const conversations: Conversation[] = [
  {
    id: '1',
    user: 'Alice Martin',
    platform: 'facebook',
    lastMessage: 'Ma commande #12345 n\'est toujours pas arrivée...',
    time: 'Il y a 15m',
    priority: 'high',
    status: 'escalated'
  },
  {
    id: '2',
    user: 'Marc Durand',
    platform: 'linkedin',
    lastMessage: 'Bonjour, j\'aimerais en savoir plus sur vos tarifs B2B.',
    time: 'Il y a 1h',
    priority: 'medium',
    status: 'escalated'
  }
];

export default function EscalatedConversations() {
  return (
    <Card className="border-slate-200 shadow-none bg-white rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle size={18} className="text-rose-500" />
          Conversations Escaladées
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {conversations.length} Urgentes
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {conversations.map((conv) => (
          <div key={conv.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {conv.platform === 'facebook' ? <Facebook size={14} className="text-blue-600" /> : <Linkedin size={14} className="text-blue-700" />}
                <span className="text-sm font-bold text-slate-700">{conv.user}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{conv.time}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mb-2 italic">
              "{conv.lastMessage}"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                <div className="w-1 h-1 rounded-full bg-rose-600 animate-pulse"></div>
                Priorité Haute
              </div>
              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline flex items-center gap-1">
                <MessageSquare size={10} />
                Répondre
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
