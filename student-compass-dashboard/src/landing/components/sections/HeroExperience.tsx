import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, memo } from "react";
import { ChevronDown } from "lucide-react";
import { HERO_CONTENT } from "@/landing/content/hero";

const primaryColor = "var(--color-primary)";

// Floating "book" cards representing academic content
const FloatingCards = memo(function FloatingCards() {
    const cards = [
        { x: -28, y: 35, rotate: -10, w: 180, h: 240, lines: [3, 5, 4, 3] },
        { x: 30, y: -8, rotate: 8, w: 160, h: 220, lines: [4, 3, 5, 2] },
        { x: 35, y: 50, rotate: 6, w: 150, h: 200, lines: [3, 4, 3, 4] },
        { x: -32, y: -25, rotate: -8, w: 170, h: 230, lines: [5, 3, 4, 2] },
    ];

    return (
        <>
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: `calc(50% + ${card.x}%)`,
                        top: `calc(50% + ${card.y}%)`,
                        rotate: `${card.rotate}deg`,
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 0.45, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div
                        className="rounded-2xl border backdrop-blur-sm shadow-lg overflow-hidden"
                        style={{
                            width: card.w,
                            height: card.h,
                            borderColor: "var(--landing-line)",
                            backgroundColor: "var(--landing-bg-soft)",
                        }}
                    >
                        {/* Card header */}
                        <div className="h-7 border-b flex items-center px-3 gap-1.5" style={{ borderColor: "var(--landing-line)", backgroundColor: "var(--landing-bg-deep)" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.6 }} />
                            <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: "var(--landing-line)" }} />
                        </div>
                        {/* Card body lines */}
                        <div className="p-3 space-y-2.5">
                            {card.lines.map((_, j) => (
                                <div
                                    key={j}
                                    className="h-1.5 rounded-full"
                                    style={{
                                        width: `${60 + j * 10}%`,
                                        backgroundColor: j % 2 === 0
                                            ? `color-mix(in srgb, ${primaryColor} 20%, transparent 80%)`
                                            : "var(--landing-line)",
                                    }}
                                />
                            ))}
                            {/* Decorative icon area */}
                            <div
                                className="mt-4 h-8 w-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent 90%)` }}
                            >
                                <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: primaryColor, opacity: 0.5 }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </>
    );
});

export default function HeroExperience() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    useSpring(mouseX, { stiffness: 50, damping: 30 });
    useSpring(mouseY, { stiffness: 50, damping: 30 });

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            mouseX.set((e.clientX - cx) / cx);
            mouseY.set((e.clientY - cy) / cy);
        };
        window.addEventListener("mousemove", handleMouse, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouse);
    }, [mouseX, mouseY]);

    return (
        <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "var(--landing-bg)" }}>
            {/* Background depth layers */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--landing-bg-soft)]/60 via-[var(--landing-bg)] to-[var(--landing-bg-deep)]/40" />
                <div
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px]"
                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 5%, transparent 95%)` }}
                />
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `conic-gradient(from 0deg, transparent, ${primaryColor}, transparent, ${primaryColor}, transparent)`,
                        opacity: 0.04,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                {/* Grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(var(--landing-line) 1px, transparent 1px), linear-gradient(90deg, var(--landing-line) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
            </div>

            <FloatingCards />

            {/* CREATIVE CASCADE layout */}
            <div className="relative z-10 min-h-screen px-6 sm:px-10 md:px-16 lg:px-20 py-20 md:py-24">
                {/* LINE 1 — top right, anchor piece */}
                <motion.h1
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[18%] right-6 sm:right-10 md:right-[6%] text-right font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--landing-text)]/80"
                    style={{ lineHeight: "1.05" }}
                >
                    {HERO_CONTENT.LINES[0]}
                </motion.h1>

                {/* LINE 2 — cascades below L1 in primary color */}
                <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[34%] right-6 sm:right-10 md:right-[30%] text-right font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    style={{ lineHeight: "1.1", color: primaryColor }}
                >
                    {HERO_CONTENT.LINES[1]}
                </motion.h1>

                {/* Subtitle area */}
                <div className="absolute top-[54%] right-6 sm:right-10 md:right-[6%] w-full max-w-full text-right">
                    {(() => {
                        const [desc, mission] = HERO_CONTENT.SUBTITLE.includes(" — ")
                            ? HERO_CONTENT.SUBTITLE.split(" — ")
                            : [HERO_CONTENT.SUBTITLE, ""];
                        return (
                            <div className="mb-6 space-y-1.5">
                                <motion.p
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-sm mr-20 sm:text-base font-bold text-[var(--landing-text)]/70 leading-relaxed"
                                >
                                    {desc}
                                </motion.p>
                                {mission && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                        className="text-xs sm:text-sm text-[var(--landing-text-muted)]/70 leading-relaxed tracking-wide"
                                    >
                                        — {mission}
                                    </motion.p>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* LINE 3 — anchored left */}
                <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[60%] left-6 sm:left-10 md:left-[40%] text-left font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--landing-text)]/80"
                    style={{ lineHeight: "1.05" }}
                >
                    {HERO_CONTENT.LINES[2]}
                </motion.h1>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            >
                <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--landing-text-muted)/40" }}>
                    {HERO_CONTENT.SCROLL_HINT}
                </span>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--landing-text-muted)/30" }} />
                </motion.div>
            </motion.div>
        </section>
    );
}
