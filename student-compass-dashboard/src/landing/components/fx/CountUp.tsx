import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
    from?: number;
    to: number;
    suffix?: string;
    className?: string;
    duration?: number;
    delay?: number;
}

export default function CountUp({
    from = 0,
    to,
    suffix = "",
    className = "",
    duration = 2,
    delay = 0,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const motionValue = useMotionValue(from);
    const rounded = useTransform(motionValue, (v) => Math.round(v));
    const display = useTransform(rounded, (v) => `${v.toLocaleString("ar")}${suffix}`);

    useEffect(() => {
        if (isInView) {
            const controls = animate(motionValue, to, {
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            });
            return controls.stop;
        }
    }, [isInView, to, duration, delay, motionValue]);

    return (
        <motion.span ref={ref} className={className}>
            {display}
        </motion.span>
    );
}
