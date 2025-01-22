"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Mountain, Building2 } from "lucide-react";

interface LocationProps {
  city: string;
  state: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  delay?: number;
}

const Location = ({
  city,
  state,
  icon,
  position,
  delay = 0,
}: LocationProps) => (
  <motion.div
    className="absolute flex flex-col items-center"
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div
      className="p-2 bg-white rounded-full shadow-lg border-2 border-amber-200"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
    </motion.div>
    <div className="text-center mt-2">
      <p className="font-semibold text-amber-900 text-sm">{city}</p>
      <p className="text-xs text-amber-700">{state}</p>
    </div>
  </motion.div>
);

const PathLine = () => (
  <svg
    className="absolute inset-0 w-full h-full pt-10 pl-10"
    style={{ zIndex: -1 }}
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    {/* Base Line */}
    <motion.line
      x1="15"
      y1="40"
      x2="85"
      y2="40"
      stroke="url(#gradient)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />

    {/* Animated Pulses */}
    <motion.circle
      r="2"
      fill="#dc2626"
      initial={{ cx: 15, cy: 40 }}
      animate={{ cx: [15, 85, 15] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="3s"
        repeatCount="indefinite"
      />
    </motion.circle>

    <motion.circle
      r="2"
      fill="#f59e0b"
      initial={{ cx: 85, cy: 40 }}
      animate={{ cx: [85, 15, 85] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="3s"
        repeatCount="indefinite"
      />
    </motion.circle>

    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

const HeartAnimation = () => (
  <motion.div
    className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
    }}
    transition={{ duration: 1, delay: 2 }}
  >
    <div className="p-2 bg-white rounded-full shadow-lg border-2 border-red-200">
      <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
    </div>
  </motion.div>
);

export function JourneyMap() {
  return (
    <div className="relative h-[32rem] w-full mx-auto">
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="relative w-full h-full">
          <PathLine />
          <Location
            city="Houston"
            state="Texas"
            icon={<Building2 className="w-5 h-5 text-amber-600" />}
            position={{ x: 15, y: 40 }}
            delay={0.2}
          />
          <Location
            city="Boulder"
            state="Colorado"
            icon={<Mountain className="w-5 h-5 text-red-600" />}
            position={{ x: 85, y: 40 }}
            delay={0.4}
          />
          <HeartAnimation />
        </div>
      </div>

      <motion.div
        className="w-full max-w-lg mx-auto px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <h3 className="text-lg text-gray-700 font-medium mb-3">
          A serendipitous meeting at a Denver wedding
        </h3>
        <p className="text-sm text-gray-600 font-light italic leading-relaxed">
          Though our paths might never have crossed - with Priyanka in Houston
          and Kaushal in Denver - fate had other plans. At a wedding in the Mile
          High City, we found something we weren&apos;t looking for: each other.
        </p>
      </motion.div>
    </div>
  );
}
