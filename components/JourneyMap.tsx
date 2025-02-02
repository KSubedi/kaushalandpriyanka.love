"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Mountain, Building2 } from "lucide-react";

interface LocationProps {
  city: string;
  state: string;
  icon: React.ReactNode;
  delay?: number;
}

const Location = ({ city, state, icon, delay = 0 }: LocationProps) => (
  <motion.div
    className="flex flex-col items-center"
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

const HeartAnimation = () => (
  <motion.div
    className="mt-4"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
    }}
    transition={{ duration: 1, delay: 2 }}
  >
    <motion.div
      className="p-2 bg-white rounded-full shadow-lg border-2 border-red-200"
      animate={{
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
    </motion.div>
  </motion.div>
);

export function JourneyMap() {
  return (
    <div className="relative h-[24rem] sm:h-[32rem] w-full mx-auto">
      <div className="relative w-full h-48 sm:h-64 flex items-center justify-center">
        <div className="relative w-full h-full flex flex-row justify-evenly gap-4">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-full h-0.5 border-t-2 border-dotted border-amber-300" />
          </div>
          <Location
            city="Houston"
            state="Texas"
            icon={<Building2 className="text-amber-600" />}
            delay={0.2}
          />
          <HeartAnimation />
          <Location
            city="Boulder"
            state="Colorado"
            icon={<Mountain className="text-red-600" />}
            delay={0.4}
          />
        </div>
      </div>

      <motion.div
        className="w-full max-w-lg mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <h3 className="text-base sm:text-lg text-gray-700 font-medium mb-2 sm:mb-3">
          A serendipitous meeting at a Denver wedding
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 font-light italic leading-relaxed">
          Though our paths might never have crossed - with Priyanka in Houston
          and Kaushal in Denver - fate had other plans. At a wedding in the Mile
          High City, we found something we weren&apos;t looking for: each other.
        </p>
      </motion.div>
    </div>
  );
}
