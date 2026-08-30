import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

interface MagneticProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export default function Magnetic({
    children,
    className = "",
    strength = 0.3,
}: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouse = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        x.set(distX * strength);
        y.set(distY * strength);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
        >
            {children}
        </motion.div>
    );
}
