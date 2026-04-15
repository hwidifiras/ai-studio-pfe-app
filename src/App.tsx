/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatsCard from './components/StatsCard';
import AnalyticsChart from './components/AnalyticsChart';
import TopPosts from './components/TopPosts';
import EscalatedConversations from './components/EscalatedConversations';
import PostComposer from './components/PostComposer';
import CalendarView from './components/CalendarView';
import InboxView from './components/InboxView';
import AiCenterView from './components/AiCenterView';
import AiAssistantView from './components/AiAssistantView';
import SettingsView from './components/SettingsView';
import AnalyticsView from './components/AnalyticsView';
import { LoadingState, EmptyState } from './components/UIStates';
import { Stat, UserRole } from '@/src/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, ShieldCheck, Filter, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const officialKPIs: Stat[] = [
  { label: 'Impressions', value: '124.5k', change: 12.5, trend: 'up', type: 'number' },
  { label: 'Taux d\'Engagement', value: '4.8', change: -2.4, trend: 'down', type: 'percentage' },
  { label: 'Temps de Réponse', value: '18m', change: -15, trend: 'up', type: 'time' },
  { label: 'Sentiment Client', value: '82', change: 5, trend: 'up', type: 'sentiment' },
];

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [role, setRole] = React.useState<UserRole>('owner');
  const [period, setPeriod] = React.useState('30j');
  const [view, setView] = React.useState<'dashboard' | 'composer' | 'calendar' | 'publications' | 'inbox' | 'analytics' | 'ai' | 'ai-config'>('dashboard');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.info('Données actualisées');
    }, 1000);
  };

  const simulateError = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsError(true);
      toast.error('Erreur de connexion aux serveurs API');
    }, 800);
  };

  const renderContent = () => {
    if (view === 'composer' || view === 'publications') {
      return <PostComposer onBack={() => setView('dashboard')} role={role} />;
    }

    if (view === 'calendar') {
      return <CalendarView role={role} onNewPost={() => setView('composer')} />;
    }

    if (view === 'inbox') {
      return <InboxView role={role} />;
    }

    if (view === 'ai') {
      return <AiAssistantView role={role} onNavigateToConfig={() => setView('ai-config')} />;
    }

    if (view === 'ai-config') {
      return <AiCenterView role={role} />;
    }

    if (view === 'analytics') {
      return <AnalyticsView role={role} />;
    }

    if (view === 'settings') {
      return <SettingsView role={role} onNavigate={setView} />;
    }

    if (view === 'dashboard') {
      return (
        <div className="space-y-8 pb-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">Tableau de bord</h1>
              <p className="text-slate-500 text-sm mt-1">Analyse des performances sociales pour SmartSocial PME.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Period Filter */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Filter size={14} className="text-slate-400 ml-1" />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[140px] border-none shadow-none h-8 text-xs font-bold text-slate-600 focus:ring-0">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7j">7 derniers jours</SelectItem>
                    <SelectItem value="30j">30 derniers jours</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-8 mx-1 opacity-50 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg gap-2 border-slate-200 text-slate-600 font-semibold h-10"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  <span className="hidden lg:inline">Actualiser</span>
                </Button>
                
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="w-[120px] rounded-lg border-slate-200 text-slate-600 font-semibold h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-16 bg-red-50/50 border border-red-100 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-red-800 mb-2">Une erreur est survenue</h3>
              <p className="text-red-600 max-w-xs mb-8 text-sm">Impossible de charger les données. Veuillez vérifier votre connexion internet.</p>
              <Button onClick={() => setIsError(false)} className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold px-8 h-11">
                Réessayer
              </Button>
            </div>
          ) : isEmpty ? (
            <EmptyState 
              title="Aucune donnée disponible" 
              description="Connectez vos comptes Facebook et LinkedIn pour commencer à voir vos statistiques."
            />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {officialKPIs.map((stat, i) => (
                  <StatsCard key={i} stat={stat} />
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnalyticsChart />
                <EscalatedConversations />
              </div>

              {/* Secondary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TopPosts />
                
                {/* Role-based UI: Policy/Config Section */}
                {(role === 'owner' || role === 'manager') ? (
                  <Card className="border-slate-200 shadow-none bg-white rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-600" />
                        Configuration Avancée
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        En tant que <strong>{role === 'owner' ? 'Propriétaire' : 'Manager'}</strong>, vous avez accès aux politiques de modération et à la configuration des webhooks.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-xs font-bold uppercase tracking-wider h-10 border-slate-100 hover:bg-slate-50">
                          Gérer les accès équipe
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs font-bold uppercase tracking-wider h-10 border-slate-100 hover:bg-slate-50">
                          Politiques de modération IA
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs font-bold uppercase tracking-wider h-10 border-slate-100 hover:bg-slate-50">
                          Logs de sécurité
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-slate-200 shadow-none bg-slate-50/50 rounded-xl border-dashed">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                      <ShieldCheck size={32} className="text-slate-300 mb-4" />
                      <h4 className="text-sm font-bold text-slate-500 mb-2">Accès Limité</h4>
                      <p className="text-xs text-slate-500">Les options de configuration avancée sont réservées aux administrateurs.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}

          {/* Debug / Simulation Bar */}
          <div className="pt-12 border-t border-slate-200 flex flex-wrap gap-4">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100" onClick={() => setIsEmpty(!isEmpty)}>
              {isEmpty ? 'Mode Données' : 'Mode Vide'}
            </Button>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100" onClick={simulateError}>
              Simuler Erreur
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
          <PlusCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Module en développement</h2>
        <p className="text-slate-500 max-w-xs">La vue "{view}" sera disponible prochainement dans le MVP.</p>
        <Button variant="outline" className="mt-8" onClick={() => setView('dashboard')}>Retour au Dashboard</Button>
      </div>
    );
  };

  return (
    <DashboardLayout 
      role={role} 
      currentView={view} 
      onNavigate={setView} 
      onNewPost={() => setView('composer')}
      forceCollapse={view === 'calendar'}
    >
      {renderContent()}
      <Toaster position="top-right" />
    </DashboardLayout>
  );
}
