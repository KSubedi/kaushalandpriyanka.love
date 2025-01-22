import React from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

type TimeBlock = {
  value: number;
  label: string;
};

type CountdownTimerProps = {
  targetDate: Date;
};

const TimeDisplay = ({ value, label }: TimeBlock) => (
  <motion.div
    className="flex flex-col items-center"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-pink-400/20 blur-xl rounded-2xl" />
      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-w-[120px]
                    border border-white/20"
      >
        <span
          className="block text-5xl font-bold bg-gradient-to-br from-blue-600 to-pink-500 
                       bg-clip-text text-transparent font-mono"
        >
          {value.toString().padStart(2, "0")}
        </span>
        <span className="block text-sm text-gray-500 font-medium mt-1 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  </motion.div>
);

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const { days, hours, minutes, seconds } = useCountdown({ targetDate });

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-pink-400/10 to-blue-400/10 blur-3xl" />
      <motion.div
        className="relative flex flex-wrap justify-center gap-6 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TimeDisplay value={days} label="Days" />
        <TimeDisplay value={hours} label="Hours" />
        <TimeDisplay value={minutes} label="Minutes" />
        <TimeDisplay value={seconds} label="Seconds" />
      </motion.div>
    </div>
  );
};
