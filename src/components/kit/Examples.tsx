/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageHeader, EmptyState } from './Patterns';
import { 
  Send, 
  Inbox, 
  Calendar, 
  Facebook, 
  Linkedin, 
  Filter, 
  Search, 
  Plus,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserRole, Thread, Post } from '@/src/types';

/**
 * EXEMPLE 1: PAGE COMPOSEUR
 */
export function ComposerExample({ role }: { role: UserRole }) {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Nouveau Post" 
        description="Créez et planifiez du contenu pour vos réseaux sociaux."
        icon={Send}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Enregistrer Brouillon</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Publier Maintenant</Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-3xl">
          <CardContent className="p-6 space-y-6">
            {/* Destination Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destinations</label>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-blue-100 bg-blue-50 text-blue-600 rounded-xl">
                  <Facebook size={16} /> Facebook
                </Button>
                <Button variant="outline" className="gap-2 border-slate-200 rounded-xl">
                  <Linkedin size={16} /> LinkedIn
                </Button>
                <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none rounded-lg">Instagram (Bientôt)</Badge>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contenu</label>
              <div className="min-h-[200px] p-4 border border-slate-200 rounded-2xl bg-slate-50/30 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <textarea 
                  placeholder="Qu'allez-vous partager aujourd'hui ?" 
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preview Pane */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aperçu</label>
          <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600" />
              <div>
                <p className="text-xs font-bold">SmartSocial PME</p>
                <p className="text-[10px] text-slate-400">Aujourd'hui à 14:00</p>
              </div>
            </div>
            <div className="p-4 min-h-[150px] bg-white">
              <p className="text-sm text-slate-300 italic">Votre contenu apparaîtra ici...</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * EXEMPLE 2: PAGE INBOX
 */
export function InboxExample({ threads }: { threads: Thread[] }) {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Inbox" 
        description="Gérez vos conversations Facebook et LinkedIn."
        icon={Inbox}
        className="mb-4"
      />
      
      <div className="flex-1 flex bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Thread List */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input placeholder="Rechercher..." className="pl-9 bg-white border-slate-200 rounded-xl h-10 text-xs" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px] font-bold uppercase tracking-tighter rounded-lg gap-2">
                <Filter size={12} /> Filtres
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {threads.map(t => (
              <button key={t.id} className="w-full p-3 text-left rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-slate-900">{t.customerName}</p>
                  <span className="text-[10px] text-slate-400">{t.lastTimestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{t.lastMessage}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] h-4 uppercase">{t.platform}</Badge>
                  <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] h-4 uppercase">{t.status}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Conversation Pane */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/10">
          <EmptyState 
            title="Sélectionnez une conversation" 
            description="Choisissez un message à gauche pour commencer à répondre."
            icon={MessageSquare}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * EXEMPLE 3: PAGE CALENDRIER
 */
export function CalendarExample() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calendrier" 
        description="Vue d'ensemble de votre stratégie de contenu."
        icon={Calendar}
        actions={
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm text-xs font-bold rounded-lg px-4">Mois</Button>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500 rounded-lg px-4">Semaine</Button>
          </div>
        }
      />
      
      <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 min-h-[600px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="p-2 border-r border-b border-slate-100 last:border-r-0 group hover:bg-slate-50/30 transition-all">
              <span className="text-[10px] font-bold text-slate-300 group-hover:text-slate-900 transition-colors">{i + 1}</span>
              {i === 12 && (
                <div className="mt-2 p-1.5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                  <p className="text-[9px] font-bold text-blue-700 truncate">Post Printemps</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Facebook size={8} className="text-blue-400" />
                    <span className="text-[8px] text-blue-400 uppercase font-bold">14:00</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
