"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SparkleProps {
  className?: string;
  color?: string;
  density?: number;
}

export function Sparkles({
  className = "",
  color = "white",
  density = 15,
}: SparkleProps) {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: string; y: string }>
  >([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const generateSparkle = (container: HTMLDivElement) => {
    const { width, height } = container.getBoundingClientRect();

    return {
      id: Math.random(),
      x: `${Math.random() * width}px`,
      y: `${Math.random() * height}px`,
    };
  };

  useEffect(() => {
    if (!containerRef) return;

    const initialSparkles = Array.from({ length: density }, () =>
      generateSparkle(containerRef)
    );
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((prev) => [...prev.slice(1), generateSparkle(containerRef)]);
    }, 500);

    return () => clearInterval(interval);
  }, [containerRef, density]);

  return (
    <div ref={setContainerRef} className={`relative ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-[3px] h-[3px] rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            background: color,
            boxShadow: `0 0 4px ${color}, 0 0 10px ${color}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </div>
  );
}
