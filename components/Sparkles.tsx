"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SparkleProps {
  className?: string;
}

export function Sparkles({ className = "" }: SparkleProps) {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === "undefined") return;

    const generateSparkle = () => {
      const windowWidth = window?.innerWidth || 1000;
      const windowHeight = window?.innerHeight || 1000;

      return {
        id: Math.random(),
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
      };
    };

    const initialSparkles = Array.from({ length: 30 }, generateSparkle);
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((prev) => [...prev.slice(1), generateSparkle()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={className}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
