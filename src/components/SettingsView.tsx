/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Building2, 
  Users, 
  Share2, 
  Send, 
  Inbox, 
  Sparkles, 
  ShieldCheck, 
  History,
  Save,
  Plus,
  MoreVertical,
  LogOut,
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Globe,
  Clock
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  UserRole, 
  Organization, 
  Member, 
  ConnectedChannel, 
  AuditLog,
  AiPolicies
} from '@/src/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  role: UserRole;
  onNavigate: (view: any) => void;
}

export default function SettingsView({ role, onNavigate }: SettingsViewProps) {
  const [activeTab, setActiveTab] = React.useState('organization');
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock Data
  const [org, setOrg] = React.useState<Organization>({
    id: 'org_1',
    name: 'SoloSoft PME',
    timezone: 'Europe/Paris',
    language: 'fr'
  });

  const [members] = React.useState<Member[]>([
    { id: '1', name: 'Jean Dupont', email: 'jean@solosoft.fr', role: 'owner', status: 'active' },
    { id: '2', name: 'Marie Curie', email: 'marie@solosoft.fr', role: 'manager', status: 'active' },
    { id: '3', name: 'Paul Martin', email: 'paul@solosoft.fr', role: 'agent', status: 'active' },
    { id: '4', name: 'Lucie Bernard', email: 'lucie@solosoft.fr', role: 'agent', status: 'invited' },
  ]);

  const [channels] = React.useState<ConnectedChannel[]>([
    { 
      id: 'fb_1', 
      platform: 'facebook', 
      name: 'SoloSoft Facebook', 
      status: 'connected',
      pages: [
        { id: 'p1', name: 'SoloSoft France', selected: true },
        { id: 'p2', name: 'SoloSoft Support', selected: false }
      ]
    },
    { 
      id: 'li_1', 
      platform: 'linkedin', 
      name: 'SoloSoft LinkedIn', 
      status: 'connected',
      pages: [
        { id: 'p3', name: 'SoloSoft Corporate', selected: true }
      ]
    }
  ]);

  const [auditLogs] = React.useState<AuditLog[]>([
    { id: 'l1', userId: '1', userName: 'Jean Dupont', action: 'Changement de rôle', details: 'Paul Martin est passé de Agent à Manager', timestamp: '2026-04-14T10:30:00Z', ipAddress: '192.168.1.1' },
    { id: 'l2', userId: '2', userName: 'Marie Curie', action: 'Connexion canal', details: 'Canal LinkedIn connecté avec succès', timestamp: '2026-04-13T15:45:00Z', ipAddress: '192.168.1.2' },
    { id: 'l3', userId: '1', userName: 'Jean Dupont', action: 'Sécurité', details: 'Activation de la 2FA', timestamp: '2026-04-12T09:00:00Z', ipAddress: '192.168.1.1' },
  ]);

  const aiPolicies: AiPolicies = {
    confidenceThreshold: 0.85,
    maxAutoPerDay: 50,
    workingHours: { start: '09:00', end: '18:00', enabled: true },
    blockedIntents: ['complaint', 'refund'],
    allowedIntents: ['greeting', 'pricing', 'hours'],
    autoReplyEnabled: true
  };

  const isOwner = role === 'owner';
  const isManager = role === 'manager';
  const canEditOrg = isOwner || isManager;
  const canManageMembers = isOwner;

  const handleSave = (section: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Paramètres ${section} enregistrés avec succès`);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paramètres</h1>
        <p className="text-slate-500">Gérez votre organisation, vos membres et vos préférences de plateforme.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-white border border-slate-200 p-1 h-auto flex-wrap justify-start">
            <TabsTrigger value="organization" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Building2 size={14} /> Organisation
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Users size={14} /> Membres & Rôles
            </TabsTrigger>
            <TabsTrigger value="channels" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Share2 size={14} /> Réseaux sociaux
            </TabsTrigger>
            <TabsTrigger value="publications" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Send size={14} /> Publications
            </TabsTrigger>
            <TabsTrigger value="inbox" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Inbox size={14} /> Inbox
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Sparkles size={14} /> IA
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <ShieldCheck size={14} /> Sécurité
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <History size={14} /> Audit
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. Organisation */}
        <TabsContent value="organization">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Informations de l'organisation</CardTitle>
              <CardDescription>Configurez l'identité visuelle et les paramètres régionaux de votre entreprise.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nom de l'organisation</Label>
                  <Input 
                    id="org-name" 
                    value={org.name} 
                    onChange={(e) => setOrg({...org, name: e.target.value})}
                    disabled={!canEditOrg}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">SS</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold" disabled={!canEditOrg}>
                      Changer le logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Fuseau horaire</Label>
                  <Select value={org.timezone} onValueChange={(v) => setOrg({...org, timezone: v})} disabled={!canEditOrg}>
                    <SelectTrigger id="timezone" className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Sélectionner un fuseau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (UTC+02:00)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+01:00)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-04:00)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> Utilisé pour la planification des publications.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-xs font-bold uppercase tracking-wider text-slate-500">Langue de l'interface</Label>
                  <Select value={org.language} onValueChange={(v) => setOrg({...org, language: v})} disabled={!canEditOrg}>
                    <SelectTrigger id="language" className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français (FR)</SelectItem>
                      <SelectItem value="en" disabled>Anglais (EN) - Bientôt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            {canEditOrg && (
              <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold" onClick={() => handleSave('organisation')} disabled={isLoading}>
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* 2. Membres & Rôles */}
        <TabsContent value="members">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Gestion de l'équipe</CardTitle>
                <CardDescription>Invitez des collaborateurs et définissez leurs niveaux d'accès.</CardDescription>
              </div>
              {canManageMembers && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold">
                  <Plus size={16} /> Inviter un membre
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Membre</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Rôle</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Statut</TableHead>
                    <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-slate-200">
                            <AvatarFallback className="text-[10px] font-bold">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{member.name}</span>
                            <span className="text-xs text-slate-400">{member.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase tracking-tighter rounded-lg",
                          member.role === 'owner' ? "border-amber-200 bg-amber-50 text-amber-700" :
                          member.role === 'manager' ? "border-blue-200 bg-blue-50 text-blue-700" :
                          "border-slate-200 bg-slate-50 text-slate-700"
                        )}>
                          {member.role === 'owner' ? 'Propriétaire' : member.role === 'manager' ? 'Manager' : 'Agent'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'active' ? "bg-green-500" : "bg-amber-500 animate-pulse")} />
                          <span className="text-xs font-medium text-slate-600">
                            {member.status === 'active' ? 'Actif' : 'Invité'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {canManageMembers && member.role !== 'owner' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <MoreVertical size={16} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Réseaux sociaux */}
        <TabsContent value="channels">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Comptes connectés</CardTitle>
              <CardDescription>Gérez les connexions aux réseaux sociaux et sélectionnez les pages actives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <Share2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{channel.name}</div>
                          <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{channel.platform}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] font-bold uppercase">Connecté</Badge>
                        {canEditOrg && (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs h-8">
                            Déconnecter
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Separator className="bg-slate-100" />
                    
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pages activées</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {channel.pages.map(page => (
                          <div key={page.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">{page.name}</span>
                            <Switch checked={page.selected} disabled={!canEditOrg} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/20">
                  <div className="p-3 bg-white rounded-full border border-slate-100 shadow-sm text-slate-300">
                    <Plus size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-600">Ajouter un nouveau canal</div>
                    <div className="text-xs text-slate-400">Connectez Instagram (Bientôt) ou d'autres comptes.</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200" disabled>Instagram</Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">Facebook</Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">LinkedIn</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Publications */}
        <TabsContent value="publications">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Préférences de publication</CardTitle>
              <CardDescription>Définissez les comportements par défaut pour la création de contenu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Sauvegarde automatique</div>
                    <div className="text-xs text-slate-500">Enregistrer les brouillons automatiquement pendant la saisie.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Mode de planification par défaut</div>
                    <div className="text-xs text-slate-500">Suggérer automatiquement le meilleur créneau horaire.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Aperçu multi-canaux</div>
                    <div className="text-xs text-slate-500">Afficher tous les aperçus de réseaux sociaux par défaut.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold" onClick={() => handleSave('publications')}>
                <Save size={16} /> Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 5. Inbox */}
        <TabsContent value="inbox">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Préférences de la messagerie</CardTitle>
              <CardDescription>Optimisez la gestion des conversations entrantes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignation automatique</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Choisir une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune (Manuel)</SelectItem>
                      <SelectItem value="round-robin">Round Robin (Équitable)</SelectItem>
                      <SelectItem value="load-balanced">Charge de travail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Délai d'escalade (minutes)</Label>
                  <Input type="number" defaultValue="30" className="rounded-xl border-slate-200" />
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Analyse de sentiment en temps réel</div>
                    <div className="text-xs text-slate-500">Détecter automatiquement l'humeur des clients.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Priorisation intelligente</div>
                    <div className="text-xs text-slate-500">Remonter les messages urgents en haut de la liste.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold" onClick={() => handleSave('inbox')}>
                <Save size={16} /> Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 6. IA */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Politiques IA actives</CardTitle>
                <CardDescription>Résumé des règles de gouvernance de l'intelligence artificielle.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seuil de confiance</div>
                    <div className="text-xl font-bold text-blue-600">{(aiPolicies.confidenceThreshold * 100).toFixed(0)}%</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Auto-réponses max / jour</div>
                    <div className="text-xl font-bold text-blue-600">{aiPolicies.maxAutoPerDay}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Intentions autorisées</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiPolicies.allowedIntents.map(intent => (
                      <Badge key={intent} variant="secondary" className="bg-green-50 text-green-700 border-green-100 font-bold">{intent}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Intentions bloquées (Escalade)</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiPolicies.blockedIntents.map(intent => (
                      <Badge key={intent} variant="secondary" className="bg-red-50 text-red-700 border-red-100 font-bold">{intent}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-between items-center">
                <span className="text-xs text-slate-500 italic">Dernière mise à jour : Il y a 2 jours</span>
                {canEditOrg && (
                  <Button 
                    variant="outline" 
                    className="rounded-xl font-bold text-blue-600 border-blue-100 hover:bg-blue-50"
                    onClick={() => onNavigate('ai-config')}
                  >
                    Modifier la configuration
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm rounded-2xl bg-blue-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={80} />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">IA Workspace</CardTitle>
                  <CardDescription className="text-blue-100">Accédez aux outils de génération quotidienne.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-blue-50 leading-relaxed">
                    Utilisez l'IA pour générer des idées de posts, reformuler vos contenus ou analyser les tendances de votre secteur.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl"
                    onClick={() => onNavigate('ai')}
                  >
                    Ouvrir le Workspace
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-slate-200 shadow-sm rounded-2xl border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Statut du modèle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Modèle actif</span>
                    <span className="font-bold text-slate-700">Gemini 1.5 Flash</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Latence moyenne</span>
                    <span className="font-bold text-green-600">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Disponibilité</span>
                    <span className="font-bold text-green-600">99.9%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 7. Sécurité du compte */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Key size={18} className="text-blue-600" /> Mot de passe
                </CardTitle>
                <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre accès.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mot de passe actuel</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nouveau mot de passe</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirmer le nouveau mot de passe</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl border-slate-200" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                  Mettre à jour
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Smartphone size={18} className="text-blue-600" /> Double authentification (2FA)
                  </CardTitle>
                  <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="p-4 bg-amber-50 rounded-full text-amber-600">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Bientôt disponible</div>
                    <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                      La double authentification par application ou SMS sera disponible dans la prochaine mise à jour.
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold border-slate-200 opacity-50 cursor-not-allowed" disabled>
                    Configurer la 2FA
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Sessions actives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-slate-400" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">Chrome sur macOS</span>
                        <span className="text-[10px] text-slate-400">Paris, France • Actuelle</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-none text-[9px] font-bold">ACTIF</Badge>
                  </div>
                  <Button variant="ghost" className="w-full text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl">
                    Déconnecter toutes les autres sessions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 8. Journal d'audit */}
        <TabsContent value="audit">
          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Journal d'audit</CardTitle>
                <CardDescription>Consultez l'historique des actions sensibles effectuées sur votre organisation.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold border-slate-200">
                <RefreshCw size={14} /> Actualiser
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Utilisateur</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Action</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Détails</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Date</TableHead>
                    <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700 text-xs">{log.userName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase bg-slate-100 text-slate-600 border-none">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate">{log.details}</TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString('fr-FR')}</TableCell>
                      <TableCell className="text-right text-[10px] font-mono text-slate-400">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-center border-t border-slate-50 p-4">
              <Button variant="ghost" className="text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl">
                Charger plus d'entrées
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
