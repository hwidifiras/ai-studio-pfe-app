/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  X, 
  Calendar as CalendarIcon, 
  Facebook, 
  Linkedin, 
  Instagram,
  Send,
  Save,
  Clock,
  AlertCircle,
  Sparkles,
  Smile,
  Hash,
  Wand2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Info,
  Globe
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { format, isBefore, startOfToday, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserRole } from '@/src/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from "@google/genai";

const connectedPages = [
  { id: 'fb-1', name: 'SoloSoft', platform: 'facebook' },
  { id: 'fb-2', name: 'SmartSocial', platform: 'facebook' },
  { id: 'li-1', name: 'SoloSoft Corp', platform: 'linkedin' },
];

interface PostComposerProps {
  onBack: () => void;
  role: UserRole;
}

export default function PostComposer({ onBack, role }: PostComposerProps) {
  const [content, setContent] = React.useState('');
  const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
  const [image, setImage] = React.useState<string | null>(null);
  const [isScheduled, setIsScheduled] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState<Date | undefined>(undefined);
  const [scheduledHour, setScheduledHour] = React.useState('12');
  const [scheduledMinute, setScheduledMinute] = React.useState('00');
  const [scheduledPeriod, setScheduledPeriod] = React.useState<'AM' | 'PM'>('PM');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const timezone = "Europe/Paris (UTC+02:00)";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image est trop volumineuse (max 5MB)');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format non supporté (JPG, PNG, WEBP uniquement)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAiAction = async (action: 'correct' | 'rephrase' | 'hashtags') => {
    if (!content.trim()) {
      toast.error('Veuillez saisir du texte avant d\'utiliser l\'IA');
      return;
    }

    setIsAiLoading(true);
    try {
      // Simulate API call to POST /orgs/:orgId/ai/generate-post
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let result = "";
      if (action === 'correct') {
        result = content + " (corrigé par l'IA)";
      } else if (action === 'rephrase') {
        result = "Version reformulée : " + content;
      } else if (action === 'hashtags') {
        result = "#SmartSocial #PME #Marketing";
      }

      if (result) {
        if (action === 'hashtags') {
          setContent(prev => `${prev}\n\n${result}`);
        } else {
          setContent(result);
        }
        toast.success('IA : Traitement terminé');
      }
    } catch (error) {
      toast.error('L\'IA n\'a pas pu traiter votre demande');
    } finally {
      setIsAiLoading(false);
    }
  };

  const validateForm = () => {
    if (!content.trim()) {
      toast.error('Le contenu de la publication ne peut pas être vide');
      return false;
    }
    if (selectedPages.length === 0) {
      toast.error('Veuillez sélectionner au moins une page de destination');
      return false;
    }
    if (isScheduled && (!scheduledDate || isBefore(scheduledDate, startOfToday()))) {
      toast.error('Veuillez sélectionner une date de planification valide (future)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (status: 'published' | 'scheduled' | 'draft') => {
    if (status !== 'draft' && !validateForm()) return;

    setIsLoading(true);
    // Simulate API calls: POST /orgs/:orgId/posts or /publish-now
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        status === 'published' ? 'Publication réussie !' : 
        status === 'scheduled' ? 'Publication planifiée avec succès' : 
        'Brouillon sauvegardé'
      );
      onBack();
    }, 1500);
  };

  const isAgent = role === 'agent';

  return (
    <div className="relative min-h-full pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Créer une publication</h1>
            <p className="text-sm text-slate-500 font-medium">Diffusez votre message sur vos pages connectées.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Unified Editor Panel (8/12) */}
        <div className="lg:col-span-8">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-6 space-y-8">
              {/* Section 1: Destinations (Compact 2-column Grid) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">1. Destinations</div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {selectedPages.length} sélectionnée(s)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {connectedPages.map((page) => (
                    <div 
                      key={page.id} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                        selectedPages.includes(page.id) 
                          ? "border-blue-200 bg-blue-50/30 ring-1 ring-blue-100" 
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"
                      )}
                      onClick={() => {
                        if (selectedPages.includes(page.id)) {
                          setSelectedPages(selectedPages.filter(id => id !== page.id));
                        } else {
                          setSelectedPages([...selectedPages, page.id]);
                        }
                      }}
                    >
                      <div className={cn(
                        "p-2 rounded-lg border shadow-sm transition-colors shrink-0",
                        selectedPages.includes(page.id) ? "bg-white border-blue-100" : "bg-white border-slate-100"
                      )}>
                        {page.platform === 'facebook' ? <Facebook size={16} className="text-blue-600" /> : <Linkedin size={16} className="text-blue-700" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-700 truncate">{page.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{page.platform}</span>
                      </div>
                      <Checkbox 
                        checked={selectedPages.includes(page.id)}
                        onCheckedChange={() => {}} 
                        className="ml-auto rounded-full border-slate-300 w-4 h-4"
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/20 opacity-50 cursor-not-allowed">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
                      <Instagram size={16} className="text-slate-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-500">Instagram</span>
                      <span className="text-[8px] uppercase font-bold text-slate-300">Bientôt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Content & AI Improvement */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">2. Contenu de la publication</div>
                <div className="relative border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all bg-white overflow-hidden">
                  <Textarea 
                    id="content"
                    placeholder="Qu'allez-vous partager aujourd'hui ?"
                    className="min-h-[180px] resize-none border-none focus-visible:ring-0 rounded-none p-5 text-base shadow-none leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  
                  {/* Toolbar */}
                  <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-lg"
                      >
                        <Smile size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg"
                        onClick={() => setContent(prev => prev + " #")}
                      >
                        <Hash size={18} />
                      </Button>
                      
                      <Separator orientation="vertical" className="h-4 mx-2 opacity-50" />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "h-9 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-bold text-xs"
                          )}
                          disabled={isAiLoading}
                        >
                          {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Améliorer avec IA
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52 rounded-xl border-slate-200 shadow-xl p-1">
                          <DropdownMenuItem className="gap-2 py-2 cursor-pointer rounded-lg text-sm" onClick={() => handleAiAction('correct')}>
                            <Wand2 size={14} className="text-blue-500" />
                            <span className="font-bold">Corriger</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 py-2 cursor-pointer rounded-lg text-sm" onClick={() => handleAiAction('rephrase')}>
                            <RefreshCw size={14} className="text-emerald-500" />
                            <span className="font-bold">Reformuler</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 py-2 cursor-pointer rounded-lg text-sm" onClick={() => handleAiAction('hashtags')}>
                            <Hash size={14} className="text-amber-500" />
                            <span className="font-bold">Hashtags</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", content.length > 2000 ? "text-red-500" : "text-slate-500")}>
                      {content.length} / 2200
                    </span>
                  </div>
                </div>

                {/* Media Preview */}
                {image && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group aspect-video max-w-sm bg-slate-50 animate-in zoom-in-95 duration-300">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setImage(null)}
                        className="rounded-lg font-bold gap-2 h-9"
                      >
                        <X size={14} />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Scheduling Summary (Visible only if scheduled) */}
              {isScheduled && scheduledDate && (
                <div className="pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Planifié pour</div>
                        <div className="text-sm font-bold text-slate-900">
                          {format(scheduledDate, 'PPP', { locale: fr })} à {scheduledHour}:{scheduledMinute} {scheduledPeriod}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{timezone}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-500 hover:text-red-500 font-bold text-xs"
                      onClick={() => {
                        setIsScheduled(false);
                        setScheduledDate(undefined);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview & Context (4/12) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">3. Aperçu & Conseils</div>
          
          {/* Preview Card */}
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aperçu Facebook</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold shadow-inner text-sm">
                  S
                </div>
                <div>
                  <div className="h-3 w-24 bg-slate-100 rounded-full mb-1.5"></div>
                  <div className="h-2 w-16 bg-slate-50 rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2.5">
                {content ? (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p>
                ) : (
                  <>
                    <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                    <div className="h-3 w-3/4 bg-slate-50 rounded-full"></div>
                  </>
                )}
              </div>
              {image && (
                <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img src={image} alt="Preview" className="w-full h-44 object-cover" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contextual Info Card */}
          <Card className="border-slate-200 shadow-sm rounded-2xl bg-blue-50/30 border-dashed">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Info size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Conseils SmartSocial</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Limite Facebook</span>
                  <span className="font-bold text-slate-700">63,206 car.</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Limite LinkedIn</span>
                  <span className="font-bold text-slate-700">3,000 car.</span>
                </div>
                <Separator className="bg-blue-100" />
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  "Les publications avec images génèrent 2.3x plus d'engagement en moyenne."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Bar (Dynamic Width) */}
      <div 
        className="fixed bottom-0 left-0 right-0 md:left-[var(--sidebar-width)] bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50 animate-in slide-in-from-bottom-full duration-500 transition-[left]"
      >
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left Group: Programmer plus tard */}
          <div className="flex items-center">
            {!isAgent && (
              <Button 
                variant="ghost" 
                className={cn(
                  "font-bold text-xs gap-2 h-11 rounded-xl px-4",
                  isScheduled ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:bg-slate-100"
                )}
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <Clock size={18} />
                {isScheduled ? "Modifier la planification" : "Programmer plus tard"}
              </Button>
            )}
            {isAgent && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                IA Prête pour optimisation
              </div>
            )}
          </div>
          
          {/* Right Group: Sauvegarder brouillon + Publier maintenant */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none border-slate-200 text-slate-600 font-bold h-11 rounded-xl gap-2 px-6 text-sm shadow-sm"
              onClick={() => handleSubmit('draft')}
              disabled={isLoading}
            >
              <Save size={18} />
              Sauvegarder brouillon
            </Button>
            
            {!isAgent ? (
              <Button 
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl gap-2 px-8 shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
                onClick={() => handleSubmit(isScheduled ? 'scheduled' : 'published')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isScheduled ? <CalendarIcon size={18} /> : <Send size={18} />)}
                {isScheduled ? 'Confirmer la planification' : 'Publier maintenant'}
              </Button>
            ) : (
              <Button 
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl gap-2 px-8 shadow-lg shadow-blue-200 text-sm"
                onClick={() => handleSubmit('draft')}
                disabled={isLoading}
              >
                <Send size={18} />
                Soumettre pour revue
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scheduling Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-slate-200 shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900">Programmer la publication</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Choisissez le moment idéal pour diffuser votre message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date de publication</Label>
              <Popover>
                <PopoverTrigger 
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-medium border-slate-200 rounded-xl h-11 shadow-sm text-sm"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-slate-400" />
                  {scheduledDate ? format(scheduledDate, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => isBefore(date, startOfToday())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heure de publication</Label>
              <div className="flex items-center gap-2">
                <Select value={scheduledHour} onValueChange={setScheduledHour}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 shadow-sm">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                      <SelectItem key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="font-bold text-slate-400">:</span>
                <Select value={scheduledMinute} onValueChange={setScheduledMinute}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 shadow-sm">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {['00', '15', '30', '45'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={scheduledPeriod} onValueChange={(v: any) => setScheduledPeriod(v)}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 shadow-sm w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timezone Info */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Globe size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fuseau : {timezone}</span>
            </div>

            {/* Summary */}
            {scheduledDate && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center animate-in fade-in duration-300">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Résumé de la planification</p>
                <p className="text-sm font-bold text-slate-900">
                  Le {format(scheduledDate, 'PPP', { locale: fr })} à {scheduledHour}:{scheduledMinute} {scheduledPeriod}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-0 gap-2 sm:gap-0">
            <Button variant="ghost" className="font-bold text-slate-500 rounded-xl h-11" onClick={() => setIsScheduleModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-blue-200"
              onClick={() => {
                if (!scheduledDate) {
                  toast.error("Veuillez sélectionner une date");
                  return;
                }
                setIsScheduled(true);
                setIsScheduleModalOpen(false);
                toast.success("Planification configurée");
              }}
            >
              Confirmer la planification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload}
      />
    </div>
  );
}
