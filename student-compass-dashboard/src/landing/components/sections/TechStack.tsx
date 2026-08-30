import { motion } from "motion/react";
import { memo } from "react";
import Magnetic from "@/landing/components/fx/Magnetic";
import ScrollChapter from "@/landing/components/fx/ScrollChapter";
import SectionLabel from "@/landing/components/shared/SectionLabel";
import { TECH_ITEMS, TECH_CATEGORIES, TECH_CATEGORY_ORDER } from "@/landing/content/tech-stack";
import type { TechItem, TechCategory } from "@/landing/content/tech-stack";
import { SECTION_LABELS } from "@/landing/content/shared";

const primaryColor = "var(--color-primary)";

const TechTile = memo(function TechTile({ name, icon: Icon, color, index }: TechItem & { index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
            className="group"
        >
            <Magnetic strength={0.08}>
                <div
                    className="relative overflow-hidden rounded-xl border p-3 transition-all duration-300 hover:shadow-md"
                    style={{
                        borderColor: "var(--landing-line)",
                        backgroundColor: "var(--landing-bg-soft)",
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "var(--landing-bg)" }}>
                            {Icon ? (
                                <Icon className="w-4 h-4" style={{ color }} />
                            ) : (
                                <span className="text-[9px] font-bold" style={{ color }}>{name.slice(0, 2)}</span>
                            )}
                        </div>
                        <span className="text-sm font-medium text-[var(--landing-text)]/80 group-hover:text-[var(--landing-text)] transition-colors">
                            {name}
                        </span>
                    </div>
                </div>
            </Magnetic>
        </motion.div>
    );
});

const CategoryGroup = memo(function CategoryGroup({ category, items }: { category: TechCategory; items: TechItem[] }) {
    const meta = TECH_CATEGORIES[category];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
        >
            {/* Category header */}
            <div className="flex items-center gap-3 pb-2" style={{ borderBottom: "1px solid var(--landing-line)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.dot }} />
                <div>
                    <h3 className="text-base font-bold text-[var(--landing-text)]">{meta.label}</h3>
                    <p className="text-xs text-[var(--landing-text-muted)]">{meta.desc}</p>
                </div>
            </div>

            {/* Tech tiles */}
            <div className="flex flex-wrap gap-2.5">
                {items.map((tech, i) => (
                    <TechTile key={tech.name} {...tech} index={i} />
                ))}
            </div>
        </motion.div>
    );
});

export default function TechStack() {
    const itemsByCategory = TECH_CATEGORY_ORDER.reduce<Record<TechCategory, TechItem[]>>((acc, cat) => {
        acc[cat] = TECH_ITEMS.filter((t) => t.category === cat);
        return acc;
    }, { frontend: [], backend: [], mobile: [], tools: [] });

    return (
        <ScrollChapter className="relative py-32 overflow-hidden" style={{ backgroundColor: "var(--landing-bg)" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--landing-bg-deep)]/30 to-transparent" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px]"
                style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 3%, transparent 97%)` }}
            />

            <div className="relative max-w-5xl mx-auto px-6">
                <div className="mb-16">
                    <SectionLabel className="mb-4">{SECTION_LABELS.TECH_STACK}</SectionLabel>
                    <h2 className="text-4xl sm:text-5xl text-[var(--landing-text)] leading-tight mb-4 max-w-2xl">
                        بنية تحتية
                        <br />
                        <span className="italic" style={{ color: primaryColor }}>تواكب المستقبل.</span>
                    </h2>
                    <p className="text-[var(--landing-text-muted)] max-w-xl text-base">
                        مجموعة التقنيات المستخدمة عبر كل طبقات منصة بوصلة الطالب.
                    </p>
                </div>

                <div className="space-y-10">
                    {TECH_CATEGORY_ORDER.map((cat) => (
                        <CategoryGroup key={cat} category={cat} items={itemsByCategory[cat]} />
                    ))}
                </div>
            </div>
        </ScrollChapter>
    );
}
