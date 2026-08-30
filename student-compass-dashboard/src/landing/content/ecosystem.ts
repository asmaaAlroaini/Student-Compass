import {
    Users,
    GraduationCap,
    BookOpen,
    ClipboardList,
    BarChart3,
    Bell,
    Settings,
    Trophy,
} from "lucide-react";

export interface EcosystemModule {
    icon: typeof GraduationCap;
    label: string;
    desc: string;
    purpose: string;
}

export const ECOSYSTEM_MODULES: EcosystemModule[] = [
    { icon: GraduationCap, label: "الهيكل الأكاديمي", desc: "مراحل وأقسام وفصول", purpose: "بناء الهيكل التعليمي الهرمي الكامل." },
    { icon: Users, label: "الطلاب", desc: "إدارة حسابات الطلاب", purpose: "تعيين الطلاب في الفصول والمسارات." },
    { icon: BookOpen, label: "المنهج", desc: "المواد والوحدات والدروس", purpose: "بناء رحلة التعلم الأكاديمية المتكاملة." },
    { icon: ClipboardList, label: "بنك الأسئلة", desc: "50,000+ سؤال", purpose: "استيراد وإدارة الأسئلة بكفاءة عالية." },
    { icon: BarChart3, label: "الاختبارات", desc: "تقييم ووزاري", purpose: "بناء الاختبارات وتحليل النتائج." },
    { icon: Trophy, label: "المسابقات", desc: "تفاعل وتحدي", purpose: "مسابقات تفاعلية ولوحة الشرف." },
    { icon: Bell, label: "الإشعارات", desc: "تنبيهات مخصصة", purpose: "إرسال إشعارات للطلاب والمعلمين." },
    { icon: Settings, label: "الإعدادات", desc: "إعدادات النظام", purpose: "تهيئة النظام وإدارة سجلات التدقيق." },
];
