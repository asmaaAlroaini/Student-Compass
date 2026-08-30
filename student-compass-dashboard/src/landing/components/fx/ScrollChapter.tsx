import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ScrollChapterProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    parallaxSpeed?: number;
}

export default function ScrollChapter({
    children,
    className = "",
    style,
    parallaxSpeed = 0.15,
}: ScrollChapterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [parallaxSpeed * 100, -parallaxSpeed * 100]);

    return (
        <section ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
            {/* Background parallax layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: bgY }}
            />
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </section>
    );
}
