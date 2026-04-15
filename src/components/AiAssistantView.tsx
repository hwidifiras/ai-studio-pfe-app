/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  Send, 
  History, 
  Copy, 
  Check, 
  RotateCcw, 
  Hash, 
  MessageCircle, 
  Lightbulb, 
  FileText, 
  Globe, 
  Zap,
  Settings,
  Info,
  ChevronRight,
  Eraser,
  ExternalLink,
  User,
  Plus,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole, AiInteraction } from '@/src/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LoadingState } from './UIStates';
import { motion, AnimatePresence } from 'motion/react';

interface AiAssistantViewProps {
  role: UserRole;
  onNavigateToConfig?: () => void;
}

const MOCK_HISTORY: AiInteraction[] = [
  {
    id: "h1",
    prompt: "Rédige un post LinkedIn pour annoncer notre nouvelle collection de printemps.",
    response: "🌸 La nouvelle collection Printemps 2026 est enfin là ! \n\nDécouvrez des designs inspirés par la nature marocaine, alliant tradition et modernité. \n\n✨ Disponible dès maintenant sur notre site.\n#ModeMarocaine #Printemps2026 #SmartSocial",
    timestamp: "2026-04-14T15:30:00Z",
    type: "generation",
    context: {
      documents: ["Catalogue_Printemps_2026.pdf"],
      language: "Français",
      latency: 1200,
      cost: "low"
    }
  },
  {
    id: "h2",
    prompt: "Réponds à ce client : 'Salam, est-ce que vous livrez à Casablanca ?'",
    response: "Salam ! 👋 Oui, nous livrons absolument à Casablanca. Le délai est généralement de 24h à 48h. Souhaitez-vous que je vous aide à passer commande ?",
    timestamp: "2026-04-14T14:15:00Z",
    type: "reply",
    context: {
      documents: ["FAQ_Livraison_Maroc.docx"],
      language: "Darija / Français",
      latency: 850,
      cost: "low"
    }
  }
];

const SUGGESTIONS = [
  { id: 'correct', label: 'Corriger', icon: Check, prompt: 'Corrige les fautes et améliore le style de ce texte : ' },
  { id: 'rephrase', label: 'Reformuler', icon: RotateCcw, prompt: 'Reformule ce texte de manière plus professionnelle : ' },
  { id: 'hashtags', label: 'Hashtags', icon: Hash, prompt: 'Génère 5 hashtags pertinents pour ce contenu : ' },
  { id: 'idea', label: 'Idée de post', icon: Lightbulb, prompt: 'Donne-moi une idée de post engageant pour ' },
  { id: 'reply', label: 'Réponse client', icon: MessageCircle, prompt: 'Rédige une réponse polie et aidante à ce message : ' },
];

export default function AiAssistantView({ role, onNavigateToConfig }: AiAssistantViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [prompt, setPrompt] = React.useState("");
  const [history, setHistory] = React.useState<AiInteraction[]>(MOCK_HISTORY);
  const [currentInteraction, setCurrentInteraction] = React.useState<AiInteraction | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isManager = role === 'owner' || role === 'manager';

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new interaction appears
  React.useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [currentInteraction, isGenerating]);

  const handleGenerate = (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const newInteraction: AiInteraction = {
        id: `h${Date.now()}`,
        prompt: finalPrompt,
        response: "Ceci est une réponse générée par l'IA basée sur votre demande. L'optimisation est réalisée via prompting, RAG et vos politiques de sécurité.",
        timestamp: new Date().toISOString(),
        type: "generation",
        context: {
          documents: ["Catalogue_Printemps_2026.pdf"],
          language: "Français",
          latency: 1100,
          cost: "low"
        }
      };
      setHistory([newInteraction, ...history]);
      setCurrentInteraction(newInteraction);
      setIsGenerating(false);
      setPrompt("");
      toast.success("Réponse générée");
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  const handleNewDiscussion = () => {
    setCurrentInteraction(null);
    setPrompt("");
    toast.info("Nouvelle discussion commencée");
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      {/* Sidebar: History (ChatGPT-like) */}
      <div className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 space-y-4">
          <Button 
            onClick={handleNewDiscussion}
            className="w-full justify-start gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm font-bold h-11 rounded-xl"
          >
            <Plus size={18} className="text-blue-600" />
            Nouvelle discussion
          </Button>
          
          <div className="flex items-center gap-2 px-2">
            <History size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Récent</span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2 pb-4 space-y-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentInteraction(item)}
                className={cn(
                  "w-full p-3 text-left rounded-xl transition-all group relative",
                  currentInteraction?.id === item.id ? "bg-white shadow-sm ring-1 ring-slate-200/50" : "hover:bg-slate-200/30"
                )}
              >
                <p className="text-xs font-medium text-slate-700 truncate pr-4">{item.prompt}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  <Badge variant="outline" className="text-[8px] h-3.5 px-1 uppercase tracking-tighter border-slate-100 text-slate-400">
                    {item.type}
                  </Badge>
                </div>
              </button>
            ))}
            {history.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <p className="text-[10px] text-slate-400 italic">Aucun historique de session</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 bg-white/50 space-y-2">
          {isManager && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-xs font-bold gap-2 text-slate-600 hover:bg-slate-100 rounded-lg h-10"
              onClick={onNavigateToConfig}
            >
              <Settings size={14} />
              Configuration IA
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-xs font-bold gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg h-10"
            onClick={() => setHistory([])}
          >
            <Eraser size={14} />
            Effacer l'historique
          </Button>
        </div>
      </div>

      {/* Main Area: Conversation (LLM-like) */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Header Disclaimer (Sticky Top) */}
        <div className="sticky top-0 z-20 px-6 py-2.5 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-xs font-bold text-slate-800">SmartSocial AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Info size={12} className="text-slate-400" />
            <span className="text-[9px] text-slate-500 font-medium italic">
              Optimisation via prompting + RAG + policies
            </span>
          </div>
        </div>

        {/* Conversation Viewport */}
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="w-full px-6 py-10 space-y-10">
            <AnimatePresence mode="popLayout">
              {currentInteraction ? (
                <div className="space-y-10">
                  {/* User Message */}
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 justify-end"
                  >
                    <div className="max-w-[85%] space-y-2">
                      <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tr-none text-sm shadow-sm">
                        {currentInteraction.prompt}
                      </div>
                      <div className="flex justify-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Vous</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <User size={14} className="text-slate-500" />
                    </div>
                  </motion.div>

                  {/* AI Message */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="max-w-[85%] space-y-4">
                      <div className="space-y-4">
                        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                          {currentInteraction.response}
                        </div>
                        
                        {/* Context & Metadata (ChatGPT-like small footer) */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {currentInteraction.context?.documents.map((doc, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] h-5 gap-1 font-bold">
                              <FileText size={10} />
                              {doc}
                            </Badge>
                          ))}
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <Globe size={10} />
                            {currentInteraction.context?.language}
                          </div>
                          <Separator orientation="vertical" className="h-3" />
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <Zap size={10} className="text-amber-400" />
                            {currentInteraction.context?.latency}ms
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3"
                          onClick={() => handleCopy(currentInteraction.response)}
                        >
                          <Copy size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Copier</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3"
                        >
                          <ExternalLink size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Utiliser</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 animate-pulse">
                      <Sparkles size={40} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm">
                      <Zap size={16} className="text-amber-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Comment puis-je vous aider ?</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Générez des posts, reformulez vos textes ou répondez à vos clients avec l'intelligence SmartSocial.
                    </p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-bounce">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="space-y-2 w-full max-w-[60%]">
                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-[80%] animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-[40%] animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area (Sticky Bottom) */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-6">
          <div className="w-full space-y-4">
            {/* Suggestions (Floating above input) */}
            {!currentInteraction && !isGenerating && (
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(s.prompt)}
                    className="h-9 gap-2 text-[10px] font-bold uppercase tracking-tighter border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all rounded-xl"
                  >
                    <s.icon size={12} />
                    {s.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Prompt Input (Safe Spacing) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                <Textarea 
                  placeholder="Posez une question ou demandez une action..."
                  className="w-full min-h-[60px] max-h-[200px] p-4 pr-14 text-sm resize-none outline-none border-none bg-transparent scrollbar-hide"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <div className="absolute right-3 bottom-3">
                  <Button 
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-xl transition-all duration-300",
                      prompt.trim() ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"
                    )}
                    onClick={() => handleGenerate()}
                    disabled={!prompt.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <LoadingState className="h-4 w-4" />
                    ) : (
                      <ArrowUp size={18} />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-center text-slate-400 font-medium">
              SmartSocial AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
