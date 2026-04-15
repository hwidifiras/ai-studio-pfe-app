/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Calendar, 
  Inbox, 
  BarChart3, 
  Sparkles, 
  Settings, 
  Bell, 
  Search,
  Menu,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole } from '@/src/types';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  currentView: string;
  onNavigate: (view: any) => void;
  onNewPost?: () => void;
  forceCollapse?: boolean;
}

export default function DashboardLayout({ 
  children, 
  role, 
  currentView, 
  onNavigate, 
  onNewPost,
  forceCollapse = false
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!forceCollapse);

  React.useEffect(() => {
    if (forceCollapse) {
      setIsSidebarOpen(false);
    }
  }, [forceCollapse]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'publications', icon: Send, label: 'Publications' },
    { id: 'calendar', icon: Calendar, label: 'Calendrier' },
    { id: 'inbox', icon: Inbox, label: 'Boîte de réception' },
    { id: 'analytics', icon: BarChart3, label: 'Analyses' },
    { id: 'ai', icon: Sparkles, label: 'IA' },
  ];

  return (
    <div 
      className="flex h-screen bg-slate-50 font-sans text-slate-900"
      style={{ '--sidebar-width': isSidebarOpen ? '240px' : '80px' } as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-60' : 'w-20'
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col hidden md:flex relative group`}
      >
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shrink-0">
              S
            </div>
            {isSidebarOpen && <span className="font-extrabold text-xl tracking-tight text-blue-600 truncate">SmartSocial</span>}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-400 hover:text-blue-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={14} />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentView === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          <Separator className="my-4 opacity-50" />

          <nav className="space-y-1">
            <button 
              onClick={() => onNavigate('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                currentView === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <Settings size={18} />
              {isSidebarOpen && <span className="font-medium text-sm">Paramètres</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              {isSidebarOpen && <span className="font-medium text-sm">Déconnexion</span>}
            </button>
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src="https://picsum.photos/seed/user/200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Jean Dupont</span>
                <span className="text-xs text-slate-600 truncate uppercase font-bold tracking-tighter">
                  {role === 'owner' ? 'Propriétaire' : role === 'manager' ? 'Manager' : 'Éditeur'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2 opacity-50" />
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-lg border-slate-200 text-slate-600 font-semibold text-sm hidden sm:flex">
                Messagerie
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-5 font-semibold text-sm"
                onClick={onNewPost}
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Nouveau Post</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <ScrollArea className="flex-1 p-8">
          <div className="w-full">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
