/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from '@/components/ui/button';
import { PlusCircle, Inbox } from 'lucide-react';

export function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200 rounded-2xl text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
        <Inbox size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-xs mb-8 text-sm leading-relaxed">{description}</p>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg px-8 font-semibold">
        <PlusCircle size={18} />
        Commencer maintenant
      </Button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string, onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-red-50/50 border border-red-100 rounded-2xl text-center">
      <h3 className="text-xl font-bold text-red-800 mb-2">Une erreur est survenue</h3>
      <p className="text-red-600 max-w-xs mb-8 text-sm">{message}</p>
      <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold px-8 h-11">
        Réessayer
      </Button>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
