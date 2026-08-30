import {
    SiReact,
    SiTypescript,
    SiTailwindcss,
    SiPhp,
    SiLaravel,
    SiFlutter,
    SiShadcnui,
    SiReacthookform,
    SiReacttable,
    SiReactquery,
    SiChartdotjs,
    SiFramer,
    SiMysql,
    SiGit,
    SiGithub,
    SiZod,
    SiLaragon,
    SiPostman,
    SiReactrouter,
    SiDart,
    SiSkeleton,
    SiFirebase,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type TechCategory = "frontend" | "backend" | "mobile" | "tools";

export interface TechItem {
    name: string;
    icon: IconType | null;
    color: string;
    category: TechCategory;
}

export const TECH_ITEMS: TechItem[] = [
    // frontend
    { name: "React 19", icon: SiReact, color: "#61DAFB", category: "frontend" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "frontend" },
    { name: "React Router v7", icon: SiReactrouter, color: "#CA4245", category: "frontend" },
    { name: "TanStack Query v5", icon: SiReactquery, color: "#FF4154", category: "frontend" },
    { name: "TanStack Table v8", icon: SiReacttable, color: "#FF4154", category: "frontend" },
    { name: "React Hook Form", icon: SiReacthookform, color: "#EC5990", category: "frontend" },
    { name: "Zod", icon: SiZod, color: "#3E67B1", category: "frontend" },
    { name: "Tailwind CSS v4", icon: SiTailwindcss, color: "#06B6D4", category: "frontend" },
    { name: "Shadcn UI", icon: SiShadcnui, color: "#000000", category: "frontend" },
    { name: "Recharts", icon: SiChartdotjs, color: "#22B573", category: "frontend" },
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF", category: "frontend" },
    { name: "Vite 7", icon: null, color: "#646CFF", category: "frontend" },
    // backend
    { name: "Laravel", icon: SiLaravel, color: "#FF2D20", category: "backend" },
    { name: "PHP", icon: SiPhp, color: "#777BB4", category: "backend" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1", category: "backend" },
    { name: "Laravel Sanctum", icon: null, color: "#FF2D20", category: "backend" },
    { name: "Laravel ActivityLog", icon: null, color: "#FF2D20", category: "backend" },
    // mobile
    { name: "Flutter", icon: SiFlutter, color: "#02569B", category: "mobile" },
    { name: "Dart", icon: SiDart, color: "#0175C2", category: "mobile" },
    { name: "Firebase", icon: SiFirebase, color: "#FFCA28", category: "mobile" },
    { name: "Bloc State", icon: null, color: "#522A9F", category: "mobile" },
    { name: "GoRouter", icon: null, color: "#0175C2", category: "mobile" },
    { name: "Dio", icon: null, color: "#0175C2", category: "mobile" },
    { name: "Skeletonizer", icon: SiSkeleton, color: "#94A3B8", category: "mobile" },
    // tools
    { name: "Git", icon: SiGit, color: "#F05033", category: "tools" },
    { name: "GitHub", icon: SiGithub, color: "#181717", category: "tools" },
    { name: "Apidog", icon: SiPostman, color: "#FF5C5C", category: "tools" },
    { name: "Laragon", icon: SiLaragon, color: "#0081C6", category: "tools" },
];

export const TECH_CATEGORIES: Record<TechCategory, { label: string; dot: string; desc: string }> = {
    frontend: { label: "الواجهة الأمامية", dot: "#61DAFB", desc: "أطر العمل والمكتبات التي تشغل تجربة المستخدم." },
    backend: { label: "الخلفية", dot: "#FF2D20", desc: "البنية التحتية للخدمات والمنطق." },
    mobile: { label: "التطبيقات الجوال", dot: "#02569B", desc: "منصة تطبيق الطالب على الأجهزة المحمولة." },
    tools: { label: "الأدوات", dot: "#F05033", desc: "أدوات التحكم بالإصدارات والتشغيل." },
};

export const TECH_CATEGORY_ORDER: TechCategory[] = ["frontend", "backend", "mobile", "tools"];
