import { motion, AnimatePresence } from "motion/react";
import type { WorkflowModule } from "@/landing/content/workflow";

interface WorkflowPopoverProps {
    module: WorkflowModule | null;
}

const primaryColor = "var(--color-primary)";

export default function WorkflowPopover({ module }: WorkflowPopoverProps) {
    return (
        <AnimatePresence mode="wait">
            {module && (
                <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border p-6"
                    style={{
                        backgroundColor: "var(--landing-bg-soft)",
                        borderColor: `color-mix(in srgb, ${primaryColor} 15%, transparent 85%)`,
                        boxShadow: `0 20px 60px -20px color-mix(in srgb, ${primaryColor} 25%, transparent 75%)`,
                    }}
                >
                    <div className="flex items-start gap-4 mb-5">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent 90%)` }}
                        >
                            <module.icon className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: primaryColor }}>
                                خطوات العمل
                            </p>
                            <h4 className="text-xl font-bold text-[var(--landing-text)]">{module.label}</h4>
                            <p className="text-xs text-[var(--landing-text-muted)] mt-1">{module.desc}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {module.steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.06 }}
                                className="rounded-xl border p-4"
                                style={{ borderColor: "var(--landing-line)", backgroundColor: "var(--landing-bg)" }}
                            >
                                <div
                                    className="h-20 rounded-lg flex items-center justify-center mb-3"
                                    style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 6%, transparent 94%)` }}
                                >
                                    <span className="text-2xl font-bold" style={{ color: `color-mix(in srgb, ${primaryColor} 35%, transparent 65%)` }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <h5 className="text-sm font-bold text-[var(--landing-text)] mb-1">{step.title}</h5>
                                <p className="text-[11px] text-[var(--landing-text-muted)] leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
