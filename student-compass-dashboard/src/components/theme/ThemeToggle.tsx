import { Monitor, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/app/store/themeStore';
import { getAccessToken } from '@/lib/authStorage';
import { nextThemeMode, type ThemeMode } from '@/lib/theme';
import { authApi } from '@/features/auth/api/authApi';
import { cn } from '@/lib/utils';

const MODE_META: Record<ThemeMode, { label: string; hint: string; Icon: typeof Sun }> = {
  light: { label: 'فاتح', hint: 'الوضع الفاتح', Icon: Sun },
  dark: { label: 'داكن', hint: 'الوضع الداكن', Icon: Moon },
  system: { label: 'تلقائي', hint: 'حسب نظام الجهاز', Icon: Monitor },
};

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const { label, hint, Icon } = MODE_META[mode];

  const handleClick = () => {
    const next = nextThemeMode(mode);
    setMode(next);

    if (getAccessToken()) {
      authApi.updateSettings({ dark_mode: next }).catch(() => {
        /* local preference still applies */
      });
    }

    toast.success(`تم تفعيل الوضع ${MODE_META[next].label}`, {
      description: MODE_META[next].hint,
      duration: 1800,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${hint} — اضغط للتبديل`}
      aria-label={`مظهر الواجهة: ${label}. تبديل الوضع`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 text-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer',
        showLabel ? 'px-3 py-2 text-xs font-semibold' : 'h-9 w-9',
        className,
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
