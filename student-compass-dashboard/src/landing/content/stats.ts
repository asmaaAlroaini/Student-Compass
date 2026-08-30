import { GraduationCap, Users, ClipboardList, BookOpen } from "lucide-react";

export interface StatItem {
    icon: typeof GraduationCap;
    value: number;
    suffix: string;
    label: string;
    sub: string;
    color: string;
}

export const STATS_ITEMS: StatItem[] = [
    { icon: GraduationCap, value: 5000, suffix: "+", label: "طالب", sub: "مسجل في المنصة", color: "var(--landing-accent)" },
    { icon: Users, value: 200, suffix: "+", label: "معلم", sub: "يدير المواد والمحتوى", color: "var(--chart-4)" },
    { icon: ClipboardList, value: 50000, suffix: "+", label: "سؤال", sub: "في بنك الأسئلة", color: "var(--chart-5)" },
    { icon: BookOpen, value: 300, suffix: "+", label: "درس", sub: "محتوى تعليمي", color: "var(--chart-2)" },
];
