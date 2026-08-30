import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, memo } from "react";
import ScrollChapter from "@/landing/components/fx/ScrollChapter";
import SectionLabel from "@/landing/components/shared/SectionLabel";
import { ECOSYSTEM_MODULES } from "@/landing/content/ecosystem";
import type { EcosystemModule } from "@/landing/content/ecosystem";
import { SECTION_LABELS } from "@/landing/content/shared";

const primaryColor = "var(--color-primary)";

const CENTER = { x: 50, y: 50 };
const RADIUS = 32;

const positionedModules = ECOSYSTEM_MODULES.map((m, i) => {
    const angle = (i / ECOSYSTEM_MODULES.length) * Math.PI * 2 - Math.PI / 2;
    return {
        ...m,
        px: CENTER.x + RADIUS * Math.cos(angle),
        py: CENTER.y + RADIUS * Math.sin(angle),
    };
});

const ModuleNode = memo(function ModuleNode({
    mod,
    px,
    py,
    i,
    isActive,
    onHover,
    onLeave,
    onClick,
}: {
    mod: EcosystemModule;
    px: number;
    py: number;
    i: number;
    isActive: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: () => void;
}) {
    const Icon = mod.icon;
    return (
        <div
            className="absolute z-10"
            style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-50%, -50%)" }}
            data-ecosystem-node=""
        >
            <motion.div
                className="flex flex-col items-center gap-2 cursor-pointer"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                onClick={onClick}
                animate={{ y: isActive ? -6 : 0 }}
            >
                <div
                    className="w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-500"
                    style={{
                        borderColor: isActive ? `color-mix(in srgb, ${primaryColor} 40%, transparent 60%)` : "var(--landing-line)",
                        backgroundColor: isActive ? `color-mix(in srgb, ${primaryColor} 10%, transparent 90%)` : "var(--landing-bg-soft)",
                        boxShadow: isActive
                            ? `0 0 20px color-mix(in srgb, ${primaryColor} 20%, transparent 80%), 0 4px 12px color-mix(in srgb, ${primaryColor} 10%, transparent 90%)`
                            : "none",
                    }}
                >
                    <Icon className="w-5 h-5" style={{ color: isActive ? primaryColor : "var(--landing-text-muted)" }} />
                </div>
                <span
                    className="text-[10px] whitespace-nowrap transition-all duration-300"
                    style={{
                        color: isActive ? primaryColor : "var(--landing-text-muted)",
                        fontWeight: isActive ? 700 : 500,
                    }}
                >
                    {mod.label}
                </span>
            </motion.div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 p-4 rounded-xl border shadow-lg backdrop-blur-md"
                        style={{
                            backgroundColor: "color-mix(in srgb, var(--landing-bg-soft) 95%, transparent 5%)",
                            borderColor: `color-mix(in srgb, ${primaryColor} 15%, transparent 85%)`,
                        }}
                    >
                        <p className="text-sm font-bold text-[var(--landing-text)] mb-1">{mod.label}</p>
                        <p className="text-xs text-[var(--landing-text-muted)] mb-1.5">{mod.desc}</p>
                        <p className="text-[10px] leading-relaxed" style={{ color: primaryColor }}>{mod.purpose}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default function EcosystemMap() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [tappedId, setTappedId] = useState<number | null>(null);

    useEffect(() => {
        if (tappedId === null) return;
        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-ecosystem-node]")) {
                setTappedId(null);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [tappedId]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 25, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 25, damping: 20 });

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            mouseX.set(((e.clientX - cx) / cx) * 2);
            mouseY.set(((e.clientY - cy) / cy) * 2);
        };
        window.addEventListener("mousemove", handleMouse, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouse);
    }, [mouseX, mouseY]);

    const anyActive = hoveredId !== null || tappedId !== null;

    return (
        <ScrollChapter className="relative py-32 overflow-hidden" style={{ backgroundColor: "var(--landing-bg)" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--landing-bg-deep)]/20 to-transparent" />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle, var(--landing-text) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    opacity: 0.03,
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <SectionLabel className="mb-4">{SECTION_LABELS.ECOSYSTEM}</SectionLabel>
                    <h2 className="text-4xl sm:text-5xl text-[var(--landing-text)] leading-tight mb-4">
                        كل شيء متصل.
                        <br />
                        <span className="italic" style={{ color: primaryColor }}>كل شيء متزامن.</span>
                    </h2>
                    <p className="text-[var(--landing-text-muted)] max-w-xl mx-auto text-base">
                        ثماني وحدات أساسية تعمل معاً كنظام تعليمي رقمي موحد.
                    </p>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <motion.div
                        className="relative w-full aspect-square"
                        style={{ rotateX: springX, rotateY: springY, perspective: 1000 }}
                    >
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                            {positionedModules.map((m, i) => {
                                const isActive = hoveredId === i || tappedId === i;
                                return (
                                    <motion.line
                                        key={i}
                                        x1={CENTER.x}
                                        y1={CENTER.y}
                                        x2={m.px}
                                        y2={m.py}
                                        stroke={isActive || !anyActive ? primaryColor : "var(--landing-line)"}
                                        strokeWidth={isActive ? 0.8 : 0.3}
                                        strokeDasharray={isActive ? "none" : "2 5"}
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 1.2, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                        style={{
                                            opacity: isActive ? 0.6 : (!anyActive ? 0.15 : 0.08),
                                            transition: "opacity 0.3s ease-in-out",
                                        }}
                                    />
                                );
                            })}
                            <circle
                                cx={CENTER.x}
                                cy={CENTER.y}
                                r={RADIUS}
                                fill="none"
                                stroke={primaryColor}
                                strokeWidth="0.12"
                                strokeDasharray="1 5"
                                opacity={0.08}
                            />
                        </svg>

                        {/* Center node */}
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="relative w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                                <span className="text-[var(--primary-foreground)] text-xs font-bold tracking-wider">البوصلة</span>
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-full border-2"
                                style={{ borderColor: `color-mix(in srgb, ${primaryColor} 25%, transparent 75%)` }}
                                animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute rounded-full border"
                                style={{
                                    borderColor: `color-mix(in srgb, ${primaryColor} 12%, transparent 88%)`,
                                    left: "-75%",
                                    top: "-75%",
                                    width: "250%",
                                    height: "250%",
                                }}
                                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.15, 0, 0.15] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            />
                        </motion.div>

                        {positionedModules.map((m, i) => (
                            <ModuleNode
                                key={m.label}
                                mod={m}
                                px={m.px}
                                py={m.py}
                                i={i}
                                isActive={hoveredId === i || tappedId === i}
                                onHover={() => setHoveredId(i)}
                                onLeave={() => setHoveredId(null)}
                                onClick={() => setTappedId(tappedId === i ? null : i)}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </ScrollChapter>
    );
}
