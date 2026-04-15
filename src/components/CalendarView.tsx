/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  subDays,
  startOfToday,
  parseISO,
  isBefore
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Facebook, 
  Linkedin, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  Search,
  X,
  User,
  Tag,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { UserRole } from '@/src/types';
import { toast } from 'sonner';
import { LoadingState, EmptyState } from './UIStates';

export interface CalendarEvent {
  id: string;
  status: 'published' | 'scheduled' | 'failed' | 'draft';
  platform: 'facebook' | 'linkedin';
  pageName: string;
  content: string;
  scheduledAt: Date;
  imageUrl?: string;
}

interface CalendarViewProps {
  role: UserRole;
  onNewPost: () => void;
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    status: 'published',
    platform: 'facebook',
    pageName: 'SoloSoft',
    content: 'Découvrez notre nouvelle fonctionnalité de gestion de projet ! #Productivité #SaaS',
    scheduledAt: subDays(startOfToday(), 1),
    imageUrl: 'https://picsum.photos/seed/post1/800/600'
  },
  {
    id: '2',
    status: 'scheduled',
    platform: 'linkedin',
    pageName: 'SoloSoft Pro',
    content: 'Pourquoi l\'automatisation est la clé de la croissance en 2026. 🚀',
    scheduledAt: addDays(startOfToday(), 2),
  },
  {
    id: '3',
    status: 'failed',
    platform: 'facebook',
    pageName: 'SoloSoft',
    content: 'Promotion exceptionnelle : -50% sur l\'abonnement annuel !',
    scheduledAt: subDays(startOfToday(), 2),
  },
  {
    id: '4',
    status: 'scheduled',
    platform: 'facebook',
    pageName: 'SoloSoft',
    content: 'Conseil du jour : Comment optimiser votre flux de travail social.',
    scheduledAt: addDays(startOfToday(), 5),
  },
  {
    id: '5',
    status: 'draft',
    platform: 'linkedin',
    pageName: 'SoloSoft Pro',
    content: 'Annonce importante à venir demain... Restez connectés !',
    scheduledAt: addDays(startOfToday(), 1),
  },
  {
    id: '6',
    status: 'scheduled',
    platform: 'facebook',
    pageName: 'SoloSoft Boutique',
    content: 'Nouveaux arrivages en stock ! 🛍️',
    scheduledAt: addDays(startOfToday(), 3),
  }
];

const CONNECTED_PAGES = [
  { id: 'fb-1', name: 'SoloSoft', platform: 'facebook' },
  { id: 'fb-2', name: 'SoloSoft Boutique', platform: 'facebook' },
  { id: 'li-1', name: 'SoloSoft Pro', platform: 'linkedin' },
];

export default function CalendarView({ role, onNewPost }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Filters state
  const [selectedPages, setSelectedPages] = React.useState<string[]>(CONNECTED_PAGES.map(p => p.name));
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(['published', 'scheduled', 'failed', 'draft']);

  React.useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentDate]);

  const nextPeriod = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 7));
  };

  const prevPeriod = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 7));
  };

  const goToToday = () => setCurrentDate(new Date());

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const pageMatch = selectedPages.includes(event.pageName);
    const statusMatch = selectedStatuses.includes(event.status);
    return pageMatch && statusMatch;
  });

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.scheduledAt, day));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCancelPost = (id: string) => {
    toast.success('Publication annulée avec succès');
    setIsDrawerOpen(false);
  };

  const handleModifyPost = (event: CalendarEvent) => {
    toast.info('Redirection vers l\'éditeur...');
    setIsDrawerOpen(false);
  };

  const togglePageFilter = (pageName: string) => {
    setSelectedPages(prev => 
      prev.includes(pageName) 
        ? prev.filter(p => p !== pageName) 
        : [...prev, pageName]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Calendrier Éditorial</h1>
        <p className="text-slate-500 text-sm mt-1">Planifiez et visualisez votre stratégie de contenu.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <Button 
            variant={viewMode === 'month' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={cn("text-xs font-bold px-4 h-8 rounded-md", viewMode === 'month' && "bg-slate-100 text-slate-900 shadow-none")}
            onClick={() => setViewMode('month')}
          >
            Mois
          </Button>
          <Button 
            variant={viewMode === 'week' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={cn("text-xs font-bold px-4 h-8 rounded-md", viewMode === 'week' && "bg-slate-100 text-slate-900 shadow-none")}
            onClick={() => setViewMode('week')}
          >
            Semaine
          </Button>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-5 font-semibold text-sm h-10"
          onClick={onNewPost}
        >
          <Plus size={16} />
          Nouveau Post
        </Button>
      </div>
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={prevPeriod} className="h-9 w-9 text-slate-500">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextPeriod} className="h-9 w-9 text-slate-500">
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <Button variant="outline" size="sm" onClick={goToToday} className="h-9 px-4 text-xs font-bold border-slate-200 text-slate-600">
          Aujourd'hui
        </Button>
        
        <h2 className="text-lg font-bold text-slate-700 min-w-[180px] capitalize">
          {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMMM yyyy', { locale: fr })}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsFilterOpen(true)}
          className={cn(
            "h-9 px-4 text-xs font-bold border-slate-200 text-slate-600 gap-2",
            (selectedPages.length < CONNECTED_PAGES.length || selectedStatuses.length < 4) && "bg-blue-50 border-blue-200 text-blue-600"
          )}
        >
          <Filter size={14} />
          Filtres
          {(selectedPages.length < CONNECTED_PAGES.length || selectedStatuses.length < 4) && (
            <Badge className="h-4 min-w-4 px-1 bg-blue-600 text-[8px] flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );

  const renderMonthGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={i} 
                className={cn(
                  "border-r border-b border-slate-100 p-2 transition-colors relative group",
                  !isCurrentMonth && "bg-slate-50/30 text-slate-300",
                  isToday && "bg-blue-50/30"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={cn(
                    "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-blue-600 text-white" : "text-slate-500"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">{dayEvents.length} post{dayEvents.length > 1 ? 's' : ''}</span>
                  )}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className={cn(
                        "p-1.5 rounded-md text-[10px] font-bold cursor-pointer border-l-2 truncate transition-all hover:translate-x-0.5",
                        event.status === 'published' ? "bg-green-50 text-green-700 border-green-500" :
                        event.status === 'scheduled' ? "bg-blue-50 text-blue-700 border-blue-500" :
                        event.status === 'failed' ? "bg-red-50 text-red-700 border-red-500" :
                        "bg-slate-100 text-slate-600 border-slate-400"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {event.platform === 'facebook' ? <Facebook size={10} /> : <Linkedin size={10} />}
                        <span className="truncate">{event.pageName}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="absolute bottom-2 right-2 p-1 bg-white border border-slate-200 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600 hover:border-blue-200 shadow-sm"
                  onClick={() => onNewPost()}
                >
                  <Plus size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekGrid = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ 
      start: startDate, 
      end: endOfWeek(startDate, { weekStartsOn: 1 }) 
    });

    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map((day, i) => (
            <div key={i} className="p-3 text-center border-r border-slate-100 last:border-r-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className={cn(
                "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mx-auto",
                isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "text-slate-700"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[600px]">
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col p-2 space-y-2",
                  isToday && "bg-blue-50/10"
                )}
              >
                {dayEvents.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-20">
                    <CalendarIcon size={20} className="text-slate-400 mb-1" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Vide</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div 
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={cn(
                          "p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                          event.status === 'published' ? "bg-green-50/50 border-green-100 text-green-800" :
                          event.status === 'scheduled' ? "bg-blue-50/50 border-blue-100 text-blue-800" :
                          event.status === 'failed' ? "bg-red-50/50 border-red-100 text-red-800" :
                          "bg-slate-50/50 border-slate-200 text-slate-600"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1">
                            {event.platform === 'facebook' ? <Facebook size={10} className="text-blue-600" /> : <Linkedin size={10} className="text-blue-700" />}
                            <span className="text-[9px] font-bold truncate max-w-[60px]">{event.pageName}</span>
                          </div>
                          <span className="text-[9px] font-bold opacity-60">{format(event.scheduledAt, 'HH:mm')}</span>
                        </div>
                        <p className="text-[10px] line-clamp-2 leading-tight mb-1.5 opacity-80">
                          {event.content}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className={cn(
                            "w-1 h-1 rounded-full",
                            event.status === 'published' ? "bg-green-500" :
                            event.status === 'scheduled' ? "bg-blue-500" :
                            event.status === 'failed' ? "bg-red-500" :
                            "bg-slate-400"
                          )} />
                          <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">
                            {event.status === 'published' ? 'Publié' : 
                             event.status === 'scheduled' ? 'Planifié' : 
                             event.status === 'failed' ? 'Échoué' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 4 && (
                      <button className="w-full py-1 text-[9px] font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        Voir {dayEvents.length - 4} de plus...
                      </button>
                    )}
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 h-8 rounded-lg text-[10px] gap-1.5 mt-auto"
                  onClick={() => onNewPost()}
                >
                  <Plus size={12} />
                  Ajouter
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBestTimeWidget = () => (
    <Card className="mt-8 border-blue-100 bg-blue-50/30 shadow-none rounded-xl overflow-hidden border-dashed">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Suggestion d'horaire optimal</h3>
            <p className="text-sm text-slate-500">Basé sur l'engagement de votre audience les 30 derniers jours.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Facebook</div>
            <div className="text-lg font-extrabold text-blue-600">Mardi, 18:30</div>
          </div>
          <Separator orientation="vertical" className="h-10 opacity-50" />
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">LinkedIn</div>
            <div className="text-lg font-extrabold text-blue-600">Jeudi, 09:15</div>
          </div>
          <Button className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-100 font-bold rounded-lg px-6 ml-4 shadow-sm">
            Appliquer
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFiltersPanel = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent side="right" className="sm:max-w-sm border-l border-slate-200 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
          <SheetTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            Filtres
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Affinez les publications affichées dans votre calendrier.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Social Media Accounts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Facebook size={14} />
              Comptes réseaux sociaux
            </h4>
            <div className="space-y-3">
              {CONNECTED_PAGES.map((page) => (
                <div key={page.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={page.id} 
                    checked={selectedPages.includes(page.name)}
                    onCheckedChange={() => togglePageFilter(page.name)}
                  />
                  <label 
                    htmlFor={page.id}
                    className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                  >
                    {page.platform === 'facebook' ? <Facebook size={12} className="text-blue-600" /> : <Linkedin size={12} className="text-blue-700" />}
                    {page.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Publication Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock size={14} />
              Statut publication
            </h4>
            <div className="space-y-3">
              {[
                { id: 'published', label: 'Publiés', color: 'bg-green-500' },
                { id: 'scheduled', label: 'Planifiés', color: 'bg-blue-500' },
                { id: 'failed', label: 'Échoués', color: 'bg-red-500' },
                { id: 'draft', label: 'Brouillons', color: 'bg-slate-400' },
              ].map((status) => (
                <div key={status.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={status.id} 
                    checked={selectedStatuses.includes(status.id)}
                    onCheckedChange={() => toggleStatusFilter(status.id)}
                  />
                  <label 
                    htmlFor={status.id}
                    className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
                  >
                    <div className={cn("w-2 h-2 rounded-full", status.color)} />
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Tags Placeholder */}
          <div className="space-y-4 opacity-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Tag size={14} />
                Tags
              </h4>
              <Badge variant="outline" className="text-[8px] h-4 px-1 uppercase tracking-tighter">Coming Soon</Badge>
            </div>
            <div className="h-10 border border-dashed border-slate-200 rounded-lg flex items-center px-3 text-xs text-slate-400 italic">
              Filtrer par tags...
            </div>
          </div>

          {/* Author Placeholder */}
          <div className="space-y-4 opacity-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User size={14} />
                Auteur
              </h4>
              <Badge variant="outline" className="text-[8px] h-4 px-1 uppercase tracking-tighter">Coming Soon</Badge>
            </div>
            <div className="h-10 border border-dashed border-slate-200 rounded-lg flex items-center px-3 text-xs text-slate-400 italic">
              Filtrer par membre d'équipe...
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl"
            onClick={() => setIsFilterOpen(false)}
          >
            Appliquer les filtres
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  if (isLoading) return <LoadingState />;

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {renderHeader()}
      {renderToolbar()}
      {renderFiltersPanel()}
      
      {filteredEvents.length === 0 ? (
        <EmptyState 
          title="Aucune publication trouvée" 
          description="Ajustez vos filtres ou créez votre première publication pour remplir votre calendrier."
        />
      ) : (
        <>
          {viewMode === 'month' ? renderMonthGrid() : renderWeekGrid()}
          {renderBestTimeWidget()}
        </>
      )}

      {/* Event Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md border-l border-slate-200 p-0 overflow-y-auto">
          {selectedEvent && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={cn(
                    "font-bold uppercase tracking-widest text-[10px] px-3 py-1",
                    selectedEvent.status === 'published' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                    selectedEvent.status === 'scheduled' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                    selectedEvent.status === 'failed' ? "bg-red-100 text-red-700 hover:bg-red-100" :
                    "bg-slate-100 text-slate-600 hover:bg-slate-100"
                  )}>
                    {selectedEvent.status === 'published' ? 'Publié' : 
                     selectedEvent.status === 'scheduled' ? 'Planifié' : 
                     selectedEvent.status === 'failed' ? 'Échoué' : 'Brouillon'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded border border-slate-200">
                      {selectedEvent.platform === 'facebook' ? <Facebook size={14} className="text-blue-600" /> : <Linkedin size={14} className="text-blue-700" />}
                    </div>
                    <span className="text-xs font-bold text-slate-600">{selectedEvent.pageName}</span>
                  </div>
                </div>
                <SheetTitle className="text-xl font-bold text-slate-800">Détails de la publication</SheetTitle>
                <SheetDescription className="text-slate-500">
                  Prévu pour le {format(selectedEvent.scheduledAt, 'PPP à HH:mm', { locale: fr })}
                </SheetDescription>
              </SheetHeader>

              <div className="p-6 space-y-8 flex-1">
                {/* Content Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contenu</h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.content}
                  </div>
                </div>

                {/* Image Preview */}
                {selectedEvent.imageUrl && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Média</h4>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img src={selectedEvent.imageUrl} alt="Post media" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                )}

                {/* Status History / Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historique & Logs</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Créé par Jean Dupont</p>
                        <p className="text-[10px] text-slate-400">{format(subDays(selectedEvent.scheduledAt, 2), 'PPp', { locale: fr })}</p>
                      </div>
                    </div>
                    {selectedEvent.status === 'published' && (
                      <div className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Publié avec succès</p>
                          <p className="text-[10px] text-slate-400">{format(selectedEvent.scheduledAt, 'PPp', { locale: fr })}</p>
                        </div>
                      </div>
                    )}
                    {selectedEvent.status === 'failed' && (
                      <div className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-red-500"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Échec de la publication</p>
                          <p className="text-[10px] text-red-500">Erreur API: Token expiré (Facebook)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <SheetFooter className="p-6 border-t border-slate-100 bg-white sticky bottom-0 flex-col sm:flex-col gap-3">
                {(role === 'owner' || role === 'manager') ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button 
                        variant="outline" 
                        className="rounded-xl font-bold h-11 gap-2 border-slate-200"
                        onClick={() => handleModifyPost(selectedEvent)}
                      >
                        <Edit3 size={16} />
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="rounded-xl font-bold h-11 gap-2 bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        onClick={() => handleCancelPost(selectedEvent.id)}
                      >
                        <Trash2 size={16} />
                        Annuler
                      </Button>
                    </div>
                    {selectedEvent.status === 'published' && (
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl gap-2">
                        <ExternalLink size={16} />
                        Voir sur {selectedEvent.platform === 'facebook' ? 'Facebook' : 'LinkedIn'}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 italic">
                      En tant qu'Éditeur, vous pouvez uniquement visualiser les détails de cette publication.
                    </p>
                  </div>
                )}
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
