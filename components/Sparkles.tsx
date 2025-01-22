import { motion } from "framer-motion";
import React from "react";

type SparklesProps = {
  className?: string;
};

export const Sparkles = ({ className }: SparklesProps) => {
  return (
    <div className={className}>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};
