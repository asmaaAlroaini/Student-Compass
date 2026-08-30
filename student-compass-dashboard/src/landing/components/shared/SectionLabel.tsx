import { motion } from "motion/react";

export default function SectionLabel({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-landing-accent/20 bg-landing-accent/5 text-landing-accent text-xs font-medium tracking-wider uppercase ${className}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse" />
            {children}
        </motion.div>
    );
}
