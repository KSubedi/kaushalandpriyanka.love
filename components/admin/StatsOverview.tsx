"use client";

import { InviteResponse } from "@/utils/interfaces/InviteType";
import { motion } from "framer-motion";
import { Users, Sun, Music, MapPin, PartyPopper } from "lucide-react";
import { useMemo } from "react";

interface StatsOverviewProps {
  responses: InviteResponse[];
  onEventSelect: (event: string | null) => void;
  selectedEvent: string | null;
}

export function StatsOverview({
  responses,
  onEventSelect,
  selectedEvent,
}: StatsOverviewProps) {
  const eventColors = {
    haldi: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      hover: "hover:bg-blue-100",
      selected: "bg-blue-100",
      icon: Sun,
      title: "Haldi",
      gradient: "from-blue-400/10 to-blue-600/10",
      gradientSelected: "from-blue-400/20 to-blue-600/20",
    },
    sangeet: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      hover: "hover:bg-blue-100",
      selected: "bg-blue-100",
      icon: Music,
      title: "Sangeet",
      gradient: "from-blue-400/10 to-blue-600/10",
      gradientSelected: "from-blue-400/20 to-blue-600/20",
    },
    wedding: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      hover: "hover:bg-blue-100",
      selected: "bg-blue-100",
      icon: PartyPopper,
      title: "Wedding",
      gradient: "from-blue-400/10 to-blue-600/10",
      gradientSelected: "from-blue-400/20 to-blue-600/20",
    },
    reception: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-900",
      hover: "hover:bg-blue-100",
      selected: "bg-blue-100",
      icon: MapPin,
      title: "Reception",
      gradient: "from-blue-400/10 to-blue-600/10",
      gradientSelected: "from-blue-400/20 to-blue-600/20",
    },
    coloradoReception: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      hover: "hover:bg-blue-100",
      selected: "bg-blue-100",
      icon: MapPin,
      title: "Colorado Reception",
      gradient: "from-blue-400/10 to-blue-600/10",
      gradientSelected: "from-blue-400/20 to-blue-600/20",
    },
  };

  const stats = useMemo(() => {
    const stats = {
      haldi: 0,
      sangeet: 0,
      wedding: 0,
      reception: 0,
      coloradoReception: 0,
      total: responses.length,
      totalGuests: responses.reduce((total, response) => {
        return total + 1 + (Number(response.additional_guests) || 0);
      }, 0),
    };

    responses.forEach((response) => {
      if (response?.events) {
        const guestCount = 1 + (Number(response.additional_guests) || 0);
        if (response.events.haldi) {
          stats.haldi += guestCount;
        }
        if (response.events.sangeet) {
          stats.sangeet += guestCount;
        }
        if (response.events.wedding) {
          stats.wedding += guestCount;
        }
        if (response.events.reception) {
          stats.reception += guestCount;
        }
        if (response.events.coloradoReception) {
          stats.coloradoReception += guestCount;
        }
      }
    });

    return stats;
  }, [responses]);

  const filteredResponses = useMemo(() => {
    if (!selectedEvent) return responses;
    return responses.filter(
      (response) =>
        response.events[selectedEvent as keyof typeof response.events]
    );
  }, [responses, selectedEvent]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full lg:col-span-1 bg-white rounded-lg shadow overflow-hidden border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Response Summary
            </h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Responses
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                    {selectedEvent ? filteredResponses.length : stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Guests
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                    {selectedEvent
                      ? filteredResponses.reduce(
                          (total, response) =>
                            total +
                            1 +
                            (Number(response.additional_guests) || 0),
                          0
                        )
                      : stats.totalGuests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-full lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {Object.entries(eventColors).map(([key, event]) => {
          const EventIcon = event.icon;
          const isSelected = selectedEvent === key;
          const guestCount = responses
            .filter((r) => r.events[key as keyof typeof r.events])
            .reduce(
              (total, r) => total + 1 + (Number(r.additional_guests) || 0),
              0
            );

          return (
            <motion.button
              key={key}
              onClick={() => onEventSelect(isSelected ? null : key)}
              className={`relative overflow-hidden rounded-lg p-4 border transition-all duration-300 ${
                event.border
              } ${event.bg} ${!isSelected && event.hover} shadow-sm`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                  isSelected ? event.gradientSelected : event.gradient
                }`}
              />
              <div className="relative">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-1">
                    <EventIcon className={`h-5 w-5 ${event.text}`} />
                    <h3 className={`font-medium ${event.text}`}>
                      {event.title}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className={`text-2xl font-bold ${event.text}`}>
                      {guestCount}
                    </p>
                    <p className={`text-sm ${event.text} opacity-80`}>
                      Confirmed Guests
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
