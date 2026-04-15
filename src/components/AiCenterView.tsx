/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  History, 
  Save, 
  Lock,
  Info,
  FileText,
  MoreVertical,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { UserRole, AiPolicies, KnowledgeDocument, ModificationLog } from '@/src/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LoadingState } from './UIStates';

interface AiCenterViewProps {
  role: UserRole;
}

const MOCK_POLICIES: AiPolicies = {
  confidenceThreshold: 0.85,
  maxAutoPerDay: 50,
  workingHours: {
    start: "09:00",
    end: "18:00",
    enabled: true,
  },
  blockedIntents: [
    "Remboursement",
    "Litige",
    "Juridique",
    "Plainte",
    "Toxicité",
    "Ambiguïté"
  ],
  allowedIntents: [
    "Salutations",
    "Horaires d'ouverture",
    "Disponibilité produit",
    "Suivi de commande simple"
  ],
  autoReplyEnabled: true,
};

const MOCK_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "1",
    name: "Catalogue_Printemps_2026.pdf",
    type: "PDF",
    status: "approved",
    uploadedAt: "2026-04-10T10:30:00Z",
    uploadedBy: "Jean Dupont",
    size: "2.4 MB"
  },
  {
    id: "2",
    name: "FAQ_Livraison_Maroc.docx",
    type: "DOCX",
    status: "pending",
    uploadedAt: "2026-04-14T15:45:00Z",
    uploadedBy: "Marie L. (Agent)",
    size: "450 KB"
  },
  {
    id: "3",
    name: "Politique_Retour_V2.pdf",
    type: "PDF",
    status: "rejected",
    uploadedAt: "2026-04-12T09:15:00Z",
    uploadedBy: "Jean Dupont",
    size: "1.1 MB"
  }
];

const MOCK_LOGS: ModificationLog[] = [
  {
    id: "l1",
    user: "Jean Dupont",
    action: "Mise à jour seuil confiance",
    date: "2026-04-14T16:00:00Z",
    details: "0.80 -> 0.85"
  },
  {
    id: "l2",
    user: "Jean Dupont",
    action: "Activation horaires ouvrables",
    date: "2026-04-13T11:20:00Z",
    details: "Activé"
  }
];

export default function AiCenterView({ role }: AiCenterViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [policies, setPolicies] = React.useState<AiPolicies>(MOCK_POLICIES);
  const [documents, setDocuments] = React.useState<KnowledgeDocument[]>(MOCK_DOCUMENTS);
  const [isSaving, setIsSaving] = React.useState(false);

  const isReadOnly = role === 'agent';

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSavePolicies = () => {
    if (isReadOnly) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Politiques mises à jour avec succès");
    }, 1000);
  };

  const handleApproveDoc = (id: string) => {
    if (isReadOnly) return;
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'approved' } : doc
    ));
    toast.success("Document approuvé");
  };

  const handleRejectDoc = (id: string) => {
    if (isReadOnly) return;
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'rejected' } : doc
    ));
    toast.error("Document rejeté");
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Centre IA</h1>
        <p className="text-slate-500">Gérez les politiques de réponse automatique et la base de connaissances de votre assistant.</p>
      </div>

      {isReadOnly && (
        <Card className="bg-amber-50 border-amber-200 shadow-none">
          <CardContent className="p-4 flex items-center gap-3 text-amber-800">
            <Lock size={18} className="shrink-0" />
            <p className="text-sm font-medium">
              Vous êtes en mode lecture seule. Seuls les Administrateurs et Managers peuvent modifier ces paramètres.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="policies" className="gap-2">
            <Shield size={16} />
            Politiques
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen size={16} />
            Connaissances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Garde-fous IA */}
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Garde-fous de réponse automatique</CardTitle>
                      <CardDescription>Configurez les limites de sécurité pour l'IA.</CardDescription>
                    </div>
                    <Switch 
                      checked={policies.autoReplyEnabled} 
                      disabled={isReadOnly}
                      onCheckedChange={(val) => setPolicies({...policies, autoReplyEnabled: val})}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Seuil de confiance */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold">Seuil de confiance minimum</Label>
                        <p className="text-xs text-slate-500">L'IA ne répondra que si son score est supérieur à ce seuil.</p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-blue-600 bg-blue-50">
                        {(policies.confidenceThreshold * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Slider 
                      value={[policies.confidenceThreshold]} 
                      min={0.75} 
                      max={0.99} 
                      step={0.01} 
                      disabled={isReadOnly}
                      onValueChange={(val) => setPolicies({...policies, confidenceThreshold: val[0]})}
                      className="py-4"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>75% (Min)</span>
                      <span>99% (Strict)</span>
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Limites et Horaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-sm font-bold">Limite auto par jour</Label>
                      <Input 
                        type="number" 
                        value={policies.maxAutoPerDay} 
                        disabled={isReadOnly}
                        onChange={(e) => setPolicies({...policies, maxAutoPerDay: parseInt(e.target.value)})}
                        className="max-w-[120px]"
                      />
                      <p className="text-xs text-slate-500">Nombre maximum de réponses automatiques autorisées par 24h.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold">Horaires ouvrables</Label>
                        <Switch 
                          checked={policies.workingHours.enabled} 
                          disabled={isReadOnly}
                          onCheckedChange={(val) => setPolicies({...policies, workingHours: {...policies.workingHours, enabled: val}})}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="time" 
                          value={policies.workingHours.start} 
                          disabled={isReadOnly || !policies.workingHours.enabled}
                          className="w-32"
                        />
                        <span className="text-slate-400">à</span>
                        <Input 
                          type="time" 
                          value={policies.workingHours.end} 
                          disabled={isReadOnly || !policies.workingHours.enabled}
                          className="w-32"
                        />
                      </div>
                      <p className="text-xs text-slate-500">L'auto-réponse est désactivée en dehors de ces plages.</p>
                    </div>
                  </div>
                </CardContent>
                {!isReadOnly && (
                  <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                    <Button onClick={handleSavePolicies} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 gap-2">
                      {isSaving ? <LoadingState className="h-4 w-4" /> : <Save size={16} />}
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Intents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-red-100 shadow-none bg-red-50/10">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertOctagon size={18} />
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Intents Bloqués</CardTitle>
                    </div>
                    <CardDescription className="text-xs">L'IA escaladera systématiquement ces sujets.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {policies.blockedIntents.map((intent, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white border border-red-100 rounded-lg text-xs font-medium text-red-700">
                        <XCircle size={12} />
                        {intent}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-green-100 shadow-none bg-green-50/10">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={18} />
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">Intents Autorisés</CardTitle>
                    </div>
                    <CardDescription className="text-xs">Sujets que l'IA peut traiter en autonomie.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {policies.allowedIntents.map((intent, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white border border-green-100 rounded-lg text-xs font-medium text-green-700">
                        <CheckCircle2 size={12} />
                        {intent}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Historique */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 text-slate-800">
                    <History size={18} />
                    <CardTitle className="text-sm font-bold">Historique des modifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {MOCK_LOGS.map((log) => (
                      <div key={log.id} className="p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">{log.action}</span>
                          <span className="text-[10px] text-slate-400">{new Date(log.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Par {log.user} • {log.details}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-600 text-white border-none shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield size={80} />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Conseil de sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed opacity-90">
                    Un seuil de confiance élevé (85%+) réduit les erreurs mais augmente le taux d'escalade. 
                    Commencez haut et ajustez selon les performances.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Base de connaissances (RAG)</CardTitle>
                <CardDescription>Documents utilisés par l'IA pour générer des réponses précises.</CardDescription>
              </div>
              <Button disabled={isReadOnly} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Upload size={16} />
                Importer un document
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Document</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'import</TableHead>
                    <TableHead>Par</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded text-slate-500">
                            <FileText size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{doc.type} • {doc.size}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter",
                            doc.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                            doc.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-red-50 text-red-600 border-red-100"
                          )}
                        >
                          {doc.status === 'approved' ? 'Approuvé' : 
                           doc.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {doc.uploadedBy}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {doc.status === 'pending' && !isReadOnly && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-green-600 border-green-100 hover:bg-green-50"
                                onClick={() => handleApproveDoc(doc.id)}
                              >
                                <Check size={14} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600 border-red-100 hover:bg-red-50"
                                onClick={() => handleRejectDoc(doc.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-600">
                  <Info size={18} />
                  <CardTitle className="text-sm font-bold">Fonctionnement du RAG</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Le RAG (Retrieval-Augmented Generation) permet à l'IA de consulter vos documents approuvés 
                  avant de répondre. Cela garantit des réponses basées sur vos données réelles.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
