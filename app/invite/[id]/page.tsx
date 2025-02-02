"use client";

import { InviteForm } from "@/components/InviteForm";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ClientSparkles } from "@/components/ClientSparkles";
import { Suspense } from "react";
import { use } from "react";

function InvitePageContent({ id }: { id: string }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-white font-inter relative overflow-hidden py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.png')] bg-repeat-space opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tl from-red-100/10 via-transparent to-amber-100/10" />
      </div>
      <ClientSparkles className="absolute inset-0 opacity-20" />

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {/* Invitation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white shadow-xl overflow-hidden"
        >
          {/* Decorative Border */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-400 via-amber-400 to-red-400" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-400 via-amber-400 to-red-400" />
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-400 via-amber-400 to-red-400" />
            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-red-400 via-amber-400 to-red-400" />
          </div>

          {/* Card Content */}
          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="text-center space-y-6 mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mx-auto"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-amber-400 rounded-full mx-auto flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </div>
                <div className="absolute -inset-4 bg-[url('/mandala-pattern.png')] bg-contain opacity-5 rotate-45" />
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                    Kaushal & Priyanka
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-gray-600"
                >
                  Request the pleasure of your company as we begin our beautiful
                  journey together
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-amber-800 font-medium"
                >
                  March 6th, 2025
                </motion.div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent my-12">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-amber-200 flex items-center justify-center">
                <Heart className="w-4 h-4 text-amber-400" fill="currentColor" />
              </div>
            </div>

            {/* Form Section */}
            <div className="max-w-2xl mx-auto">
              <InviteForm inviteId={id} />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitePageContent id={resolvedParams.id} />
    </Suspense>
  );
}
