"use client";

import React from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { motion } from "framer-motion";
import { Sparkles } from "@/components/Sparkles";
import {
  Heart,
  Music,
  Sun,
  PartyPopper,
  Flower,
  Plane,
  Code,
  Bike,
  Mountain,
  MapPin,
  Calendar,
} from "lucide-react";

const MandalaPattern = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-amber-50/50" />
    <div className="absolute inset-0 bg-[url('/mandala-pattern.png')] bg-repeat-space opacity-[0.05] mix-blend-overlay" />
    <div className="absolute inset-0 bg-gradient-to-tl from-red-100/10 via-transparent to-amber-100/10" />
  </div>
);

const DecorativeLine = () => (
  <div className="flex items-center justify-center space-x-4 py-8">
    <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent flex-grow" />
    <Flower className="w-5 h-5 text-amber-400/50 rotate-45" />
    <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent flex-grow" />
  </div>
);

const FloatingIcon = ({
  icon: Icon,
  color,
  delay = 0,
  position,
  size = "w-6 h-6",
}: {
  icon: React.ElementType;
  color: string;
  delay?: number;
  position: { x: number; y: number };
  size?: string;
}) => (
  <motion.div
    className="absolute"
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0.5, 0.8, 0.5],
      y: [0, -10, 0],
      x: [0, 5, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Icon className={`${size} ${color} opacity-50`} />
  </motion.div>
);

const CoupleSection = () => {
  return (
    <motion.div
      className="relative rounded-3xl p-16 overflow-hidden bg-gradient-to-r from-red-50/30 via-white to-amber-50/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto">
        <motion.div
          className="w-[45%] space-y-6"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl font-bold text-red-700">Kaushal</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            A dreamer who loves building cool tech and chasing adventures. When
            not coding the next big thing, you&apos;ll find him exploring
            mountain trails on his motorcycle or planning the next outdoor
            escapade.
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center w-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-px h-32 bg-gradient-to-b from-transparent via-amber-300 to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <motion.div
            className="relative z-10 p-3 rounded-full bg-white shadow-lg border border-amber-200"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
          </motion.div>
        </div>

        <motion.div
          className="w-[45%] space-y-6 text-right"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl font-bold text-amber-700">Priyanka</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            A free spirit with a contagious smile and endless creativity.
            Dancing through life while turning ordinary moments into
            unforgettable memories. Always ready for the next adventure or a
            spontaneous dance party.
          </p>
        </motion.div>
      </div>

      {/* Floating icons with adjusted positions */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Kaushal's icons */}
        <FloatingIcon
          icon={Code}
          color="text-red-400"
          delay={0}
          position={{ x: 12, y: 30 }}
        />
        <FloatingIcon
          icon={Bike}
          color="text-red-500"
          delay={2}
          position={{ x: 18, y: 60 }}
        />
        <FloatingIcon
          icon={Mountain}
          color="text-red-400"
          delay={4}
          position={{ x: 8, y: 75 }}
        />

        {/* Priyanka's icons */}
        <FloatingIcon
          icon={Music}
          color="text-amber-400"
          delay={1}
          position={{ x: 88, y: 35 }}
        />
        <FloatingIcon
          icon={Calendar}
          color="text-amber-500"
          delay={3}
          position={{ x: 82, y: 65 }}
        />
        <FloatingIcon
          icon={Plane}
          color="text-amber-400"
          delay={5}
          position={{ x: 92, y: 80 }}
        />
      </div>
    </motion.div>
  );
};

const EventCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="relative group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div
      className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-amber-400/10 blur-xl rounded-2xl 
                    group-hover:from-red-400/20 group-hover:to-amber-400/20 transition-all duration-300"
    />
    <div
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 
                    border border-amber-100 shadow-lg group-hover:shadow-xl transition-all duration-300"
    >
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4
                   bg-white rounded-full shadow-lg border border-amber-200"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-8 h-8 text-red-600" />
      </motion.div>
      <motion.h3
        className="text-2xl font-bold text-amber-800 mt-6 mb-4"
        whileHover={{ x: 10 }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
      <motion.div
        className="mt-6 flex justify-end"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <span className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
          Learn more →
        </span>
      </motion.div>
    </div>
  </motion.div>
);

export function MainContent() {
  const weddingDate = new Date("2025-03-06T00:00:00");

  return (
    <main className="min-h-screen bg-white font-inter relative overflow-hidden">
      <MandalaPattern />
      <Sparkles className="absolute inset-0 opacity-20" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-24 max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              <p className="text-red-600 font-medium tracking-wide mb-4">
                Save the Date
              </p>
              <div className="flex justify-center items-center space-x-6 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart
                    className="w-10 h-10 text-red-500"
                    fill="currentColor"
                  />
                </motion.div>
                <h1 className="text-7xl font-bold text-amber-900 tracking-tight">
                  Kaushal & Priyanka
                </h1>
              </div>
              <p className="text-2xl text-amber-800 font-light italic">
                are beginning their forever
              </p>
            </motion.div>

            <DecorativeLine />

            {/* Date Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <p className="text-3xl font-light text-red-800">
                March 6th, 2025
              </p>
              <p className="text-lg text-amber-700">Kathmandu, Nepal</p>
            </motion.div>
          </div>

          {/* Countdown Section */}
          <div className="py-8">
            <CountdownTimer targetDate={weddingDate} />
          </div>

          {/* About Us Section */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-800">Our Story</h2>
              <p className="text-gray-700 mt-2">Two paths becoming one</p>
            </div>
            <CoupleSection />
          </section>

          {/* Wedding Events Section */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-800">
                Wedding Events
              </h2>
              <p className="text-gray-700 mt-2">Join us in celebration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <EventCard
                icon={Sun}
                title="Haldi"
                description="A beautiful ceremony where turmeric paste is applied to bless the couple with prosperity and purification"
              />
              <EventCard
                icon={Music}
                title="Sangeet"
                description="An evening filled with music, dance, and joyous celebrations with our beloved family and friends"
              />
              <EventCard
                icon={MapPin}
                title="Wedding"
                description="The main ceremony where we take our sacred vows and begin our journey as one"
              />
              <EventCard
                icon={PartyPopper}
                title="Reception"
                description="A grand celebration to receive blessings from all our loved ones as we start our new life"
              />
            </div>
          </section>

          <DecorativeLine />

          {/* Save the Date Section */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl text-gray-700 italic">
              Join us as we begin our journey together as the Subedis
            </p>
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-full 
                         text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300
                         hover:from-red-500 hover:to-amber-400 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Save the Date</span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
