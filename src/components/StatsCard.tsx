/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Clock, 
  Smile, 
  Meh, 
  Frown 
} from 'lucide-react';
import { Stat } from '@/src/types';

interface StatsCardProps {
  stat: Stat;
  key?: React.Key;
}

export default function StatsCard({ stat }: StatsCardProps) {
  const isUp = stat.trend === 'up';
  const isDown = stat.trend === 'down';

  const renderIcon = () => {
    if (stat.type === 'time') return <Clock size={16} className="text-slate-400" />;
    if (stat.type === 'sentiment') {
      const val = parseInt(stat.value);
      if (val > 70) return <Smile size={16} className="text-emerald-500" />;
      if (val > 40) return <Meh size={16} className="text-amber-500" />;
      return <Frown size={16} className="text-rose-500" />;
    }
    return null;
  };

  return (
    <Card className="border-slate-200 shadow-none bg-white rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            {renderIcon()}
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">
              {stat.value}{stat.type === 'percentage' || stat.type === 'sentiment' ? '%' : ''}
            </h3>
            {stat.change !== undefined && (
              <div className={`flex items-center gap-0.5 text-xs font-bold ${
                isUp ? 'text-emerald-500' : 
                isDown ? 'text-rose-500' : 
                'text-slate-400'
              }`}>
                {isUp && <ArrowUpRight size={14} />}
                {isDown && <ArrowDownRight size={14} />}
                {!isUp && !isDown && <Minus size={14} />}
                {Math.abs(stat.change)}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
