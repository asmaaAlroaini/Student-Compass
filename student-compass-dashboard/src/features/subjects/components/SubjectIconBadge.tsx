import React from 'react';
import {
  BookOpen,
  FlaskConical,
  Atom,
  Calculator,
  Globe,
  PenTool,
  Languages,
  Scroll,
  Palette,
  Scale,
  Lightbulb,
} from 'lucide-react';

interface SubjectIconBadgeProps {
  icon?: string | null;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// خريطة لتحديد الأيقونات الافتراضية المناسبة حسب اسم المادة
const getSubjectIconComponent = (name?: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('فيزياء') || n.includes('physic')) return Atom;
  if (n.includes('كيمياء') || n.includes('chem')) return FlaskConical;
  if (n.includes('أحياء') || n.includes('bio')) return Lightbulb;
  if (n.includes('رياضيات') || n.includes('حساب') || n.includes('math')) return Calculator;
  if (n.includes('إنجليزي') || n.includes('english')) return Languages;
  if (n.includes('عربي') || n.includes('arabic') || n.includes('لغة')) return BookOpen;
  if (n.includes('إسلام') || n.includes('قرآن') || n.includes('دين')) return Scroll;
  if (n.includes('تاريخ') || n.includes('history')) return Scroll;
  if (n.includes('جغرافيا') || n.includes('geography')) return Globe;
  if (n.includes('فلسفة') || n.includes('منطق')) return Scale;
  if (n.includes('رسم') || n.includes('فنون') || n.includes('art')) return Palette;
  if (n.includes('حاسوب') || n.includes('برمجة') || n.includes('تقنية')) return PenTool;
  return BookOpen;
};

// خريطة التدرجات اللونية حسب التخصص
const getSubjectColorGradient = (name?: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('فيزياء') || n.includes('physic')) return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
  if (n.includes('كيمياء') || n.includes('chem')) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
  if (n.includes('أحياء') || n.includes('bio')) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  if (n.includes('رياضيات') || n.includes('math')) return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
  if (n.includes('إنجليزي') || n.includes('english')) return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
  if (n.includes('عربي') || n.includes('arabic')) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  if (n.includes('إسلام') || n.includes('قرآن')) return 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30';
  if (n.includes('تاريخ') || n.includes('جغرافيا')) return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
  return 'bg-primary/15 text-primary border-primary/30';
};

const sizeClasses = {
  sm: 'w-8 h-8 rounded-xl text-sm',
  md: 'w-10 h-10 rounded-2xl text-base',
  lg: 'w-12 h-12 rounded-2xl text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const SubjectIconBadge: React.FC<SubjectIconBadgeProps> = ({
  icon,
  name,
  className = '',
  size = 'md',
}) => {
  const raw = (icon || '').trim();
  const isImageFile =
    raw.endsWith('.png') ||
    raw.endsWith('.jpg') ||
    raw.endsWith('.jpeg') ||
    raw.endsWith('.svg') ||
    raw.endsWith('.webp') ||
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('/storage/') ||
    raw.startsWith('/uploads/');

  const isEmoji =
    raw.length > 0 &&
    !isImageFile &&
    raw.length <= 4 &&
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(raw);

  const colorClasses = getSubjectColorGradient(name);
  const FallbackIcon = getSubjectIconComponent(name);

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border select-none overflow-hidden ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {isEmoji ? (
        <span className="leading-none">{raw}</span>
      ) : isImageFile && (raw.startsWith('http') || raw.startsWith('/')) ? (
        <img
          src={raw}
          alt={name || 'مادة'}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <FallbackIcon className={iconSizes[size]} />
      )}
    </div>
  );
};

export default SubjectIconBadge;
