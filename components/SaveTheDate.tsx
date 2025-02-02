"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { generateCalendarUrl } from "@/utils/calendar";

export function SaveTheDate() {
  const handleSaveDate = () => {
    const link = document.createElement("a");
    link.href = generateCalendarUrl();
    link.download = "kaushal-priyanka-wedding.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button
      onClick={handleSaveDate}
      className="group relative px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-amber-500 
                 text-white rounded-full text-base sm:text-lg font-medium shadow-lg 
                 hover:shadow-xl transition-all duration-300
                 hover:from-red-500 hover:to-amber-400 w-full sm:w-auto"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
        Save the Date
      </span>
      <div
        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                   rounded-full"
      />
    </motion.button>
  );
}
