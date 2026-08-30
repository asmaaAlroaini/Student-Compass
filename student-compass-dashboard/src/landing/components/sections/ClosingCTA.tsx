import { motion } from "motion/react";
import { GraduationCap, ArrowLeft } from "lucide-react";
import ScrollChapter from "@/landing/components/fx/ScrollChapter";
import { FOOTER } from "@/landing/content/shared";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const primaryColor = "var(--color-primary)";

export default function ClosingCTA() {
    return (
        <ScrollChapter
            className="relative py-40 overflow-hidden"
            style={{ backgroundColor: "var(--landing-bg)" }}
        >
            {/* Background radial glow */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 100%, color-mix(in srgb, ${primaryColor} 8%, transparent 92%), transparent 70%)`,
                }}
            />
            {/* Grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(var(--landing-line) 1px, transparent 1px), linear-gradient(90deg, var(--landing-line) 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                }}
            />

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                {/* Animated logo */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                    style={{
                        backgroundColor: primaryColor,
                        boxShadow: `0 20px 60px color-mix(in srgb, ${primaryColor} 30%, transparent 70%)`,
                    }}
                >
                    <GraduationCap className="w-9 h-9 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl sm:text-6xl font-bold text-[var(--landing-text)] mb-6 leading-tight"
                >
                    جاهز للانطلاق؟
                    <br />
                    <span className="italic" style={{ color: primaryColor }}>ابدأ الآن.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[var(--landing-text-muted)] text-lg max-w-xl mx-auto mb-12 leading-relaxed"
                >
                    منصة بوصلة الطالب تجمع كل أدوات الإدارة الأكاديمية في مكان واحد.
                    دخول فوري — لا تعقيد.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center gap-4 flex-wrap"
                >
                    <Link
                        to={ROUTES.PUBLIC.LOGIN}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span className="relative z-10">دخول اللوحة</span>
                        <ArrowLeft className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    </Link>

                    <a
                        href="#ecosystem"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                            borderColor: "var(--landing-line)",
                            color: "var(--landing-text)",
                            backgroundColor: "var(--landing-bg-soft)",
                        }}
                    >
                        استكشف النظام
                    </a>
                </motion.div>
            </div>
        </ScrollChapter>
    );
}

export function LandingFooter() {
    const year = new Date().getFullYear();
    return (
        <footer
            className="relative border-t py-12 px-6"
            style={{ borderColor: "var(--landing-line)", backgroundColor: "var(--landing-bg)" }}
        >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm text-[var(--landing-text)]">{FOOTER.BRAND}</span>
                </div>
                <p className="text-xs text-[var(--landing-text-muted)]">
                    © {year} — {FOOTER.COPYRIGHT}
                </p>
            </div>
        </footer>
    );
}
