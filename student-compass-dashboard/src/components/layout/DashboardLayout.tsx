import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Trophy,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Layers,
  UserCheck,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  Shield,
  User as UserIcon,
  Sparkles,
  Plus,
  Import,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { ROUTES } from '@/constants/routes';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// ── Sidebar Navigation Config ──
interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  adminOnly?: boolean;
  children?: { label: string; path: string; icon?: React.ComponentType<{ className?: string }> }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'الرئيسية',
    path: ROUTES.DASHBOARD.OVERVIEW,
    icon: LayoutDashboard,
  },
  {
    label: 'الهيكل التعليمي',
    path: ROUTES.DASHBOARD.ACADEMIC,
    icon: Layers,
    adminOnly: true,
    badge: 'Admin',
    badgeColor: 'bg-rose-500/20 text-rose-300',
    children: [
      { label: 'المراحل الدراسية', path: ROUTES.DASHBOARD.ACADEMIC_STAGES },
      { label: 'المسارات والأقسام', path: ROUTES.DASHBOARD.ACADEMIC_TRACKS },
      { label: 'الفصول والصفوف', path: ROUTES.DASHBOARD.ACADEMIC_CLASSROOMS },
    ],
  },
  {
    label: 'المواد والمناهج',
    path: ROUTES.DASHBOARD.SUBJECTS,
    icon: BookOpen,
    children: [
      { label: 'قائمة المواد', path: ROUTES.DASHBOARD.SUBJECTS },
    ],
  },
  {
    label: 'بنك الأسئلة',
    path: ROUTES.DASHBOARD.QUESTIONS,
    icon: HelpCircle,
    badge: '50k+',
    badgeColor: 'bg-blue-500/20 text-blue-300',
    children: [
      { label: 'الأسئلة', path: ROUTES.DASHBOARD.QUESTIONS },
      { label: 'استيراد جماعي (Excel)', path: ROUTES.DASHBOARD.QUESTIONS_IMPORT },
    ],
  },
  {
    label: 'الاختبارات والتقييمات',
    path: ROUTES.DASHBOARD.EXAMS,
    icon: FileCheck2,
    children: [
      { label: 'قائمة الاختبارات', path: ROUTES.DASHBOARD.EXAMS },
      { label: 'إنشاء اختبار جديد', path: ROUTES.DASHBOARD.EXAMS_CREATE },
    ],
  },
  {
    label: 'إدارة المعلمين',
    path: ROUTES.DASHBOARD.TEACHERS,
    icon: UserCheck,
    adminOnly: true,
    badge: 'Admin',
    badgeColor: 'bg-rose-500/20 text-rose-300',
  },
  {
    label: 'إدارة الطلاب',
    path: ROUTES.DASHBOARD.STUDENTS,
    icon: Users,
  },
  {
    label: 'المسابقات ولوحة الشرف',
    path: ROUTES.DASHBOARD.COMPETITIONS,
    icon: Trophy,
    children: [
      { label: 'المسابقات', path: ROUTES.DASHBOARD.COMPETITIONS },
      { label: 'إنشاء مسابقة', path: ROUTES.DASHBOARD.COMPETITIONS_CREATE },
    ],
  },
  {
    label: 'مركز الإشعارات',
    path: ROUTES.DASHBOARD.NOTIFICATIONS,
    icon: Bell,
  },
  {
    label: 'التقارير والتحليلات',
    path: ROUTES.DASHBOARD.REPORTS,
    icon: BarChart3,
  },
  {
    label: 'الإعدادات',
    path: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
    children: [
      { label: 'الملف الشخصي', path: ROUTES.DASHBOARD.SETTINGS_PROFILE },
      { label: 'إعدادات النظام', path: ROUTES.DASHBOARD.SETTINGS_SYSTEM },
      { label: 'النسخ الاحتياطي', path: ROUTES.DASHBOARD.SETTINGS_BACKUP },
    ],
  },
];

// ── Role Badge Helper ──
function getRoleBadge(role?: string) {
  switch (role) {
    case 'admin':
      return { label: 'المدير العام', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' };
    case 'teacher':
      return { label: 'معلم المادة', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' };
    case 'supervisor':
      return { label: 'مشرف تربوي', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' };
    default:
      return { label: 'طالب', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' };
  }
}

// ── Sidebar Nav Item Component ──
function SideNavItem({ item, collapsed = false, onClick }: { item: NavItem; collapsed?: boolean; onClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  if (item.adminOnly && !isAdmin) return null;

  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all group cursor-pointer"
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {open && !collapsed && (
          <div className="mr-9 mt-1 space-y-0.5 border-r border-sidebar-border pr-2">
            {item.children!.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                end
                onClick={onClick}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <ChevronLeft className="w-3 h-3 opacity-50" />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`} />
          {!collapsed && (
            <>
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );
}

// ── Main DashboardLayout ──
export default function DashboardLayout() {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen flex bg-background text-foreground antialiased" dir="rtl">

      {/* ══════════════════════════════════════════
          SIDEBAR — Desktop
      ══════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground border-l border-sidebar-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
          {/* Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            {!sidebarCollapsed ? (
              <Link to={ROUTES.DASHBOARD.HOME} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Compass className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-sidebar-foreground tracking-tight leading-none">بوصلة الطالب</div>
                  <div className="text-[10px] text-blue-400 font-medium mt-0.5">لوحة التحكم</div>
                </div>
              </Link>
            ) : (
              <Link to={ROUTES.DASHBOARD.HOME} className="mx-auto">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              </Link>
            )}
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">
                القائمة الرئيسية
              </p>
            )}
            {NAV_ITEMS.map((item) => (
              <SideNavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="w-full p-2.5 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-muted/40 border border-sidebar-border space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
                  {user?.name?.charAt(0) ?? <UserIcon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate">{user?.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`} />
                {roleBadge.label}
              </span>
            </div>
          )}

          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          TOP HEADER
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card/90 border-b border-border backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">

          {/* Left: Hamburger (mobile) + Breadcrumb area */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-foreground">بوصلة الطالب</span>
            </div>
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Role badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${roleBadge.color}`}>
              <Shield className="w-3 h-3" />
              {roleBadge.label}
            </span>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
              {user?.name?.charAt(0) ?? <UserIcon className="w-4 h-4" />}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" dir="rtl">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 bg-sidebar text-sidebar-foreground border-l border-sidebar-border flex flex-col justify-between h-full overflow-y-auto shadow-2xl">
            {/* Header */}
            <div>
              <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-foreground text-sm">بوصلة الطالب</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">
                  القائمة الرئيسية
                </p>
                {NAV_ITEMS.map((item) => (
                  <SideNavItem key={item.path} item={item} onClick={() => setMobileOpen(false)} />
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-3">
              <ThemeToggle showLabel className="w-full" />
              <div className="p-3 rounded-2xl bg-muted/40 border border-sidebar-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                    {user?.name?.charAt(0) ?? 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{user?.name}</div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
