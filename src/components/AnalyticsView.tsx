/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MessageSquare, 
  Clock, 
  Smile, 
  Meh, 
  Frown,
  Facebook,
  Linkedin,
  Calendar as CalendarIcon,
  Download,
  Filter,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingState, EmptyState, ErrorState } from './UIStates';
import { UserRole, AnalyticsOverview, TopPost, InboxPerformance } from '@/src/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fetchAnalyticsOverview, fetchTopPosts, fetchInboxPerformance } from '@/src/services/analyticsService';

interface AnalyticsViewProps {
  role: UserRole;
}

const SENTIMENT_COLORS = {
  positive: '#22c55e',
  neutral: '#94a3b8',
  negative: '#ef4444'
};

export default function AnalyticsView({ role }: AnalyticsViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [period, setPeriod] = React.useState('30d');
  const [overview, setOverview] = React.useState<AnalyticsOverview | null>(null);
  const [topPosts, setTopPosts] = React.useState<TopPost[]>([]);
  const [inboxPerf, setInboxPerf] = React.useState<InboxPerformance | null>(null);

  const isAgent = role === 'agent';
  const canExport = role === 'owner' || role === 'manager';

  // Helper to calculate dates based on period
  const getDatesFromPeriod = (p: string) => {
    const to = new Date();
    const from = new Date();
    
    switch (p) {
      case '7d': from.setDate(to.getDate() - 7); break;
      case '30d': from.setDate(to.getDate() - 30); break;
      case '90d': from.setDate(to.getDate() - 90); break;
      case '12m': from.setFullYear(to.getFullYear() - 1); break;
      default: from.setDate(to.getDate() - 30);
    }
    
    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    };
  };

  React.useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const orgId = 'current-org'; // Dynamisé via context en prod
      const { from, to } = getDatesFromPeriod(period);

      const [overviewData, postsData, perfData] = await Promise.all([
        fetchAnalyticsOverview(orgId, from, to),
        fetchTopPosts(orgId, 10),
        fetchInboxPerformance(orgId, from, to)
      ]);

      setOverview(overviewData);
      setTopPosts(postsData);
      setInboxPerf(perfData);
      setIsLoading(false);
    } catch (err) {
      setError("Impossible de charger les données analytiques.");
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!canExport) {
      toast.error("Action réservée aux administrateurs (Owner/Manager)");
      return;
    }
    toast.success("Exportation des données en cours...");
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!overview) return (
    <EmptyState 
      title="Aucune donnée analytique" 
      description="Nous n'avons pas encore assez de données pour générer vos analyses. Revenez plus tard."
    />
  );

  const sentimentData = [
    { name: 'Positif', value: overview.sentiment.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutre', value: overview.sentiment.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Négatif', value: overview.sentiment.negative, color: SENTIMENT_COLORS.negative },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Analyses</h1>
          <p className="text-slate-500 mt-1">Suivez la performance de votre présence sociale.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="12m">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          
          {canExport && (
            <Button 
              variant="outline" 
              className="rounded-xl border-slate-200 font-bold text-slate-600 gap-2 bg-white animate-in zoom-in duration-300"
              onClick={handleExport}
            >
              <Download size={16} />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Impressions" 
          value={overview.impressions.toLocaleString()} 
          change={overview.impressionsChange} 
          icon={Eye} 
          description="Nombre total de vues"
        />
        <KpiCard 
          title="Taux d'engagement" 
          value={`${overview.engagementRate}%`} 
          change={overview.engagementRateChange} 
          icon={TrendingUp} 
          description="Interactions / Impressions"
        />
        <KpiCard 
          title="Temps de réponse" 
          value={`${overview.responseTime} min`} 
          change={overview.responseTimeChange} 
          icon={Clock} 
          description="Moyenne de premier contact"
          inverseTrend
        />
        <KpiCard 
          title="Volume Inbox" 
          value={inboxPerf?.resolvedCount.toString() || "0"} 
          change={5.2} 
          icon={MessageSquare} 
          description="Conversations traitées"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Analysis */}
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Smile className="text-blue-600" size={20} />
              Sentiment des commentaires
            </CardTitle>
            <CardDescription>Analyse IA des interactions récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4">
              {sentimentData.map((s) => (
                <div key={s.name} className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.name}</span>
                  <span className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inbox Performance Chart */}
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={20} />
              Volume de messages par jour
            </CardTitle>
            <CardDescription>Activité de la boîte de réception sur la période</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inboxPerf?.volumeByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Table */}
      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Top Publications</CardTitle>
            <CardDescription>Les posts les plus performants par engagement</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 font-bold gap-1">
            Voir tout
            <ChevronRight size={16} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[400px]">Contenu</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-right">Taux</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="w-10 h-10 rounded-lg object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <MessageSquare size={16} className="text-slate-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium line-clamp-1">{post.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.platform === 'facebook' ? (
                        <Facebook size={14} className="text-blue-600" />
                      ) : (
                        <Linkedin size={14} className="text-blue-700" />
                      )}
                      <span className="text-xs font-semibold capitalize">{post.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium">
                    {post.date}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {post.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {post.engagement.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 font-bold">
                      {post.engagementRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  description: string;
  inverseTrend?: boolean;
}

function KpiCard({ title, value, change, icon: Icon, description, inverseTrend = false }: KpiCardProps) {
  const isPositive = change > 0;
  const isGood = inverseTrend ? !isPositive : isPositive;
  
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white hover:border-blue-200 transition-colors group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Icon size={20} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            isGood ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
          <div className="text-2xl font-black text-slate-900">{value}</div>
          <p className="text-[11px] text-slate-400 font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
