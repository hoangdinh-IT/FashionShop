import { motion, type Variants } from "framer-motion";
import type React from "react";

interface Props {
    message?: string;
    className?: string;
}

const dotVariants: Variants = {
    animate: (i: number) => ({
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
        },
    }),
};

const Loading: React.FC<Props> = ({ 
    message = "Đang tải dữ liệu...", 
    className = "" 
}) => {
    return (
        <div className={`flex-1 flex flex-col items-center justify-center bg-white min-h-[400px] ${className}`}>
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={dotVariants}
                        animate="animate"
                        className="w-3 h-3 bg-indigo-500 rounded-full"
                    />
                ))}
            </div>
            <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse text-center">
                {message}
            </p>
        </div>
    );
};

export default Loading;