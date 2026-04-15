/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  Facebook, 
  Linkedin, 
  MessageSquare, 
  MessageCircle, 
  MoreHorizontal,
  MoreVertical, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  User,
  Bot,
  ChevronRight,
  RefreshCw,
  History,
  Info,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { UserRole } from '@/src/types';
import { toast } from 'sonner';
import { LoadingState, EmptyState } from './UIStates';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

export type ThreadStatus = 'new' | 'in_progress' | 'replied' | 'escalated';
export type ThreadType = 'comment' | 'message';
export type Platform = 'facebook' | 'linkedin';
export type ReplyMode = 'manual' | 'assisted' | 'auto';
export type Assignee = 'me' | 'team' | 'unassigned';

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  senderName: string;
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Thread {
  id: string;
  platform: Platform;
  type: ThreadType;
  status: ThreadStatus;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastTimestamp: Date;
  unreadCount: number;
  mode: ReplyMode;
  confidence?: number; // 0-100
  intention?: string;
  assignee: Assignee;
  escalationReason?: string;
  decisionHistory?: { date: Date; action: string; reason: string }[];
}

interface InboxViewProps {
  role: UserRole;
}

// --- Mock Data ---

const MOCK_THREADS: Thread[] = [
  {
    id: '1',
    platform: 'facebook',
    type: 'message',
    status: 'new',
    customerName: 'Amine Benjelloun',
    lastMessage: 'Salam, est-ce que vous livrez à Casablanca ?',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 1,
    mode: 'assisted',
    confidence: 92,
    intention: 'Demande de livraison',
    assignee: 'me',
  },
  {
    id: '2',
    platform: 'linkedin',
    type: 'comment',
    status: 'escalated',
    customerName: 'Sarah Martin',
    lastMessage: 'Votre solution semble intéressante, mais quid de la sécurité des données ?',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    mode: 'manual',
    intention: 'Question technique / Sécurité',
    assignee: 'team',
    escalationReason: 'Question technique complexe sur la RGPD',
    decisionHistory: [
      { date: new Date(Date.now() - 1000 * 60 * 60 * 1.5), action: 'Escalade automatique', reason: 'Seuil de confiance IA < 70%' }
    ]
  },
  {
    id: '3',
    platform: 'facebook',
    type: 'comment',
    status: 'replied',
    customerName: 'Karim Tazi',
    lastMessage: 'Merci pour votre réponse rapide !',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    mode: 'auto',
    confidence: 98,
    intention: 'Remerciement',
    assignee: 'unassigned',
  },
  {
    id: '4',
    platform: 'facebook',
    type: 'message',
    status: 'in_progress',
    customerName: 'Laila Mansouri',
    lastMessage: 'I need help with my order #12345. Fin rakom?',
    lastTimestamp: new Date(Date.now() - 1000 * 60 * 45),
    unreadCount: 2,
    mode: 'assisted',
    confidence: 85,
    intention: 'Suivi de commande',
    assignee: 'me',
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'customer', senderName: 'Amine Benjelloun', content: 'Salam, est-ce que vous livrez à Casablanca ?', timestamp: new Date(Date.now() - 1000 * 60 * 15), sentiment: 'neutral' }
  ],
  '2': [
    { id: 'm2', sender: 'customer', senderName: 'Sarah Martin', content: 'Votre solution semble intéressante, mais quid de la sécurité des données ?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), sentiment: 'neutral' }
  ],
  '4': [
    { id: 'm3', sender: 'customer', senderName: 'Laila Mansouri', content: 'Hello, I ordered yesterday.', timestamp: new Date(Date.now() - 1000 * 60 * 60), sentiment: 'neutral' },
    { id: 'm4', sender: 'customer', senderName: 'Laila Mansouri', content: 'I need help with my order #12345. Fin rakom?', timestamp: new Date(Date.now() - 1000 * 60 * 45), sentiment: 'negative' }
  ]
};

// --- Main Component ---

export default function InboxView({ role }: InboxViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [threads, setThreads] = React.useState<Thread[]>(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = React.useState<string | null>(MOCK_THREADS[0].id);
  const [filterChannel, setFilterChannel] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterType, setFilterType] = React.useState('all');
  const [filterAssignee, setFilterAssignee] = React.useState('all');
  const [replyText, setReplyText] = React.useState('');
  const [isAiDrafting, setIsAiDrafting] = React.useState(false);
  const [aiDraft, setAiDraft] = React.useState<string | null>(null);

  const isManager = role === 'owner' || role === 'manager';

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const selectedThread = threads.find(t => t.id === selectedThreadId);
  const messages = selectedThreadId ? MOCK_MESSAGES[selectedThreadId] || [] : [];

  const handleSendReply = (mode: 'manual' | 'assisted') => {
    if (!replyText && !aiDraft) return;
    
    toast.success('Réponse envoyée avec succès');
    setReplyText('');
    setAiDraft(null);
    
    // Update thread status locally
    if (selectedThreadId) {
      setThreads(prev => prev.map(t => 
        t.id === selectedThreadId ? { ...t, status: 'replied', unreadCount: 0 } : t
      ));
    }
  };

  const handleGenerateAiDraft = () => {
    setIsAiDrafting(true);
    // Simulate backend AI call
    setTimeout(() => {
      const lastMsg = messages[messages.length - 1]?.content || '';
      let draft = "Bonjour, merci pour votre message. Nous serions ravis de vous aider.";
      
      if (lastMsg.toLowerCase().includes('casablanca')) {
        draft = "Salam ! Oui, nous livrons absolument à Casablanca sous 24h à 48h. Souhaitez-vous passer commande ?";
      } else if (lastMsg.toLowerCase().includes('rakom')) {
        draft = "Salam Laila ! Désolé pour l'attente. Concernant votre commande #12345, elle est en cours de préparation. Hna m3ak !";
      }
      
      setAiDraft(draft);
      setIsAiDrafting(false);
      toast.info('Brouillon IA généré');
    }, 1500);
  };

  const handleToggleAutoMode = () => {
    if (!isManager) return;
    
    if (selectedThreadId) {
      setThreads(prev => prev.map(t => {
        if (t.id === selectedThreadId) {
          const newMode = t.mode === 'auto' ? 'assisted' : 'auto';
          toast.success(newMode === 'auto' ? 'Mode Auto activé' : 'Mode Auto désactivé');
          return { ...t, mode: newMode };
        }
        return t;
      }));
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      {/* Left: Thread List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-bold">
              {threads.filter(t => t.unreadCount > 0).length} nouveaux
            </Badge>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder="Rechercher..." 
              className="pl-9 h-9 text-xs border-slate-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-tighter border-slate-200 bg-white w-full">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous canaux</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-tighter border-slate-200 bg-white w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="comment">Commentaire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-tighter border-slate-200 bg-white w-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="new">Nouveaux</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="replied">Répondus</SelectItem>
                <SelectItem value="escalated">Escaladés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-tighter border-slate-200 bg-white w-full">
                <SelectValue placeholder="Assigné" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="me">Moi</SelectItem>
                <SelectItem value="team">Équipe</SelectItem>
                <SelectItem value="unassigned">Non assigné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-2">
            <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-blue-600 leading-tight font-medium">
              <strong>Règle LinkedIn :</strong> Commentaires uniquement. Les messages privés ne sont pas supportés par l'API LinkedIn.
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-50">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={cn(
                  "w-full p-4 text-left transition-all hover:bg-slate-50 relative group",
                  selectedThreadId === thread.id ? "bg-white shadow-sm ring-1 ring-slate-100 z-10" : ""
                )}
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 border border-slate-100">
                      <AvatarImage src={`https://picsum.photos/seed/${thread.id}/200`} />
                      <AvatarFallback>{thread.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-slate-50">
                      {thread.platform === 'facebook' ? <Facebook size={10} className="text-blue-600" /> : <Linkedin size={10} className="text-blue-700" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-bold text-slate-700 truncate">{thread.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatTime(thread.lastTimestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {thread.type === 'message' ? <MessageCircle size={10} className="text-slate-400" /> : <MessageSquare size={10} className="text-slate-400" />}
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                        {thread.type === 'message' ? 'Message' : 'Commentaire'}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      thread.unreadCount > 0 ? "text-slate-800 font-semibold" : "text-slate-500"
                    )}>
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  {thread.status === 'escalated' && (
                    <Badge variant="destructive" className="text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter bg-red-50 text-red-600 border-red-100">
                      Escaladé
                    </Badge>
                  )}
                  {thread.mode === 'auto' && (
                    <Badge className="text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter bg-purple-50 text-purple-600 border-purple-100">
                      Mode Auto
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Conversation Panel */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-100">
                  <AvatarImage src={`https://picsum.photos/seed/${selectedThread.id}/200`} />
                  <AvatarFallback>{selectedThread.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{selectedThread.customerName}</h3>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter border-slate-100 text-slate-400">
                      {selectedThread.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      selectedThread.status === 'new' ? "bg-blue-500" :
                      selectedThread.status === 'replied' ? "bg-green-500" :
                      selectedThread.status === 'escalated' ? "bg-red-500" : "bg-slate-400"
                    )} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {selectedThread.status === 'new' ? 'Nouveau' : 
                       selectedThread.status === 'replied' ? 'Répondu' : 
                       selectedThread.status === 'escalated' ? 'Escaladé' : 'En cours'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedThread.mode === 'auto' ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                      <Bot size={14} className="text-purple-600" />
                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Mode Auto Actif</span>
                      <Badge className="bg-purple-600 text-[8px] h-4">{selectedThread.confidence}%</Badge>
                    </div>
                    {selectedThread.intention && (
                      <span className="text-[9px] font-bold text-purple-400 mt-1 uppercase tracking-tighter">
                        Intention : {selectedThread.intention}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                      <User size={14} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Mode Manuel / Assisté</span>
                    </div>
                    {selectedThread.intention && (
                      <span className="text-[9px] font-bold text-blue-400 mt-1 uppercase tracking-tighter">
                        Intention : {selectedThread.intention}
                      </span>
                    )}
                  </div>
                )}
                
                {isManager && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToggleAutoMode}
                    className={cn(
                      "h-9 rounded-lg font-bold text-xs gap-2",
                      selectedThread.mode === 'auto' ? "border-purple-200 text-purple-600 hover:bg-purple-50" : "border-slate-200 text-slate-600"
                    )}
                  >
                    {selectedThread.mode === 'auto' ? <RefreshCw size={14} /> : <Bot size={14} />}
                    {selectedThread.mode === 'auto' ? 'Désactiver Auto' : 'Activer Auto'}
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <ScrollArea className="flex-1 p-6 bg-slate-50/20">
              <div className="w-full space-y-6">
                {/* Escalation Info if applicable */}
                {selectedThread.status === 'escalated' && (
                  <Card className="border-red-100 bg-red-50/50 shadow-none rounded-xl overflow-hidden mb-6">
                    <CardContent className="p-4 flex gap-4">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0 h-fit">
                        <AlertTriangle size={18} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-red-800">Conversation Escaladée</h4>
                        <p className="text-xs text-red-600 leading-relaxed">
                          <strong>Raison :</strong> {selectedThread.escalationReason}
                        </p>
                        {selectedThread.decisionHistory && (
                          <div className="mt-3 pt-3 border-t border-red-100 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                              <History size={12} />
                              Historique des décisions
                            </div>
                            {selectedThread.decisionHistory.map((h, i) => (
                              <div key={i} className="text-[10px] text-red-500/70 italic">
                                {formatTime(h.date)} : {h.action} - {h.reason}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-3",
                      msg.sender === 'customer' ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-8 w-8 border border-slate-100 shrink-0">
                      <AvatarImage src={msg.sender === 'customer' ? `https://picsum.photos/seed/${selectedThread.id}/200` : "https://picsum.photos/seed/agent/200"} />
                      <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "flex flex-col max-w-[70%]",
                      msg.sender === 'customer' ? "items-start" : "items-end"
                    )}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-300">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.sender === 'customer' 
                          ? "bg-white border border-slate-100 text-slate-700 rounded-tl-none" 
                          : "bg-blue-600 text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                      {msg.sentiment && msg.sender === 'customer' && (
                        <div className="mt-1 px-1">
                          <Badge variant="outline" className={cn(
                            "text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter",
                            msg.sentiment === 'positive' ? "text-green-500 border-green-100" :
                            msg.sentiment === 'negative' ? "text-red-500 border-red-100" : "text-slate-400 border-slate-100"
                          )}>
                            Sentiment : {msg.sentiment === 'positive' ? 'Positif' : msg.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isAiDrafting && (
                  <div className="flex gap-3 flex-row-reverse animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <Bot size={14} className="text-slate-400" />
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl rounded-tr-none w-48 h-12"></div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Response Area */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="w-full space-y-4">
                {aiDraft ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Brouillon IA Généré</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400" onClick={() => setAiDraft(null)}>
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed italic">
                      "{aiDraft}"
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg px-4 h-9 gap-2"
                        onClick={() => handleSendReply('assisted')}
                      >
                        <Check size={14} />
                        Valider et Envoyer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-lg px-4 h-9 gap-2"
                        onClick={() => {
                          setReplyText(aiDraft);
                          setAiDraft(null);
                        }}
                      >
                        <Edit3 size={14} />
                        Modifier manuellement
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="relative border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all bg-white overflow-hidden">
                    <textarea 
                      placeholder="Écrivez votre réponse ici..."
                      className="w-full min-h-[100px] p-4 text-sm resize-none outline-none border-none"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold text-xs"
                          onClick={handleGenerateAiDraft}
                          disabled={isAiDrafting}
                        >
                          <Sparkles size={14} />
                          Générer brouillon IA
                        </Button>
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <ThumbsUp size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <ThumbsDown size={14} />
                        </Button>
                      </div>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg px-6 h-9 gap-2"
                        onClick={() => handleSendReply('manual')}
                        disabled={!replyText}
                      >
                        <Send size={14} />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Canal Connecté</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Info size={12} className="text-slate-300" />
                      <span className="text-[10px] text-slate-400 italic">Réponse IA en Français par défaut</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Appuyez sur <kbd className="px-1 bg-slate-100 rounded border border-slate-200">Cmd + Enter</kbd> pour envoyer
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/20">
            <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
              <Inbox size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sélectionnez une conversation</h3>
            <p className="text-slate-500 max-w-xs text-sm">
              Choisissez un fil de discussion à gauche pour commencer à répondre à vos clients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helpers ---

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 1000 * 60 * 60) {
    return `${Math.floor(diff / (1000 * 60))}m`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    return `${Math.floor(diff / (1000 * 60 * 60))}h`;
  } else {
    return format(date, 'd MMM', { locale: fr });
  }
}

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Inbox, X } from 'lucide-react';
