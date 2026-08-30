import { motion } from "motion/react";
import CountUp from "@/landing/components/fx/CountUp";
import ScrollChapter from "@/landing/components/fx/ScrollChapter";
import SectionLabel from "@/landing/components/shared/SectionLabel";
import { STATS_ITEMS } from "@/landing/content/stats";
import { SECTION_LABELS } from "@/landing/content/shared";

const primaryColor = "var(--color-primary)";

export default function StatsRail() {
    return (
        <ScrollChapter
            className="relative py-32 overflow-hidden"
            style={{ backgroundColor: "var(--landing-bg-soft)" }}
        >
            {/* Subtle gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--landing-bg-deep)]/20 via-transparent to-[var(--landing-bg-deep)]/20" />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(var(--landing-line) 1px, transparent 1px), linear-gradient(90deg, var(--landing-line) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                    opacity: 0.5,
                }}
            />

            <div className="relative max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <SectionLabel className="mb-4">{SECTION_LABELS.STATS}</SectionLabel>
                    <h2 className="text-4xl sm:text-5xl text-[var(--landing-text)] leading-tight mb-4">
                        أرقام تتحدث
                        <br />
                        <span className="italic" style={{ color: primaryColor }}>عن نفسها.</span>
                    </h2>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS_ITEMS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative rounded-2xl border p-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                style={{
                                    borderColor: "var(--landing-line)",
                                    backgroundColor: "var(--landing-bg)",
                                }}
                            >
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                    style={{
                                        background: `radial-gradient(circle at 50% 0%, ${stat.color}10, transparent 70%)`,
                                    }}
                                />

                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: `${stat.color}14` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                </div>

                                {/* Number */}
                                <div
                                    className="text-4xl sm:text-5xl font-bold mb-1 tabular-nums"
                                    style={{ color: stat.color }}
                                >
                                    <CountUp to={stat.value} suffix={stat.suffix} duration={2.5} delay={i * 0.1} />
                                </div>

                                {/* Label */}
                                <p className="text-sm font-bold text-[var(--landing-text)] mb-1">{stat.label}</p>
                                <p className="text-xs text-[var(--landing-text-muted)]">{stat.sub}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </ScrollChapter>
    );
}
