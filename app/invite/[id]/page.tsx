"use client";

import { InviteForm } from "@/components/InviteForm";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ClientSparkles } from "@/components/ClientSparkles";
import { Suspense } from "react";
import { use } from "react";
import Image from "next/image";
import { Imperial_Script } from "next/font/google";

const imperialScript = Imperial_Script({
  weight: "400",
  subsets: ["latin"],
});

function InvitePageContent({ id }: { id: string }) {
  return (
    <main className="min-h-screen bg-white/80 backdrop-blur-sm font-inter relative overflow-hidden md:py-12 md:px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/graphics/pattern.webp')] bg-repeat opacity-[0.9] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tl from-red-100/10 via-transparent to-amber-100/10" />
      </div>

      <ClientSparkles className="absolute inset-0 opacity-20" />

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Invitation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden"
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
                <div className="relative w-60 h-48 mx-auto mb-8 overflow-hidden">
                  <Image
                    src="/graphics/ganesh.svg"
                    alt="Kaushal and Priyanka"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 192px"
                    priority
                  />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-amber-400 rounded-full mx-auto flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </div>
              </motion.div>

              <div className="space-y-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-5xl md:text-6xl font-bold ${imperialScript.className}`}
                >
                  <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                    Kaushal & Priyanka
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg max-w-xl mx-auto md:text-xl text-gray-600"
                >
                  Request the pleasure of your company as we begin our beautiful
                  journey together.
                </motion.p>
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
