import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  features?: string[];
}

export function PagePlaceholder({
  title,
  description,
  icon: Icon = Construction,
  badge,
  badgeColor = 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  features = [],
}: PagePlaceholderProps) {
  return (
    <div className="min-h-[calc(100vh-9rem)] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="w-full max-w-lg space-y-6">

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center text-muted-foreground">
            <Icon className="w-9 h-9" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 border-2 border-[#090f20] flex items-center justify-center">
            <span className="text-[9px] font-black text-white">!</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          {badge && (
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-black text-foreground tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">{description}</p>
        </div>

        {/* Feature preview list */}
        {features.length > 0 && (
          <div className="p-4 rounded-2xl bg-card border border-border text-right space-y-2.5">
            <p className="text-xs font-semibold text-muted-foreground mb-3">الميزات المخطط تطويرها في هذا القسم:</p>
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span className="text-xs text-foreground/80">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar teaser */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center gap-3 text-right">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <Construction className="w-4 h-4" />
          </div>
          <p className="text-xs text-amber-200/80">هذا القسم قيد التطوير وسيتم إطلاقه قريباً ضمن مراحل البناء القادمة.</p>
        </div>

      </div>
    </div>
  );
}

export default PagePlaceholder;
