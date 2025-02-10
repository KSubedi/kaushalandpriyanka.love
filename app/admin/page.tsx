"use client";

import { InviteResponse } from "@/utils/interfaces/InviteType";
import { motion } from "framer-motion";
import { Users, Sun, Music, MapPin, PartyPopper, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function AdminDashboard() {
  const [responses, setResponses] = useState<InviteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const fetchResponses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/responses");
      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }
      const data = await response.json();
      setResponses(data.responses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const stats = useMemo(() => {
    const stats = {
      haldi: 0,
      sangeet: 0,
      wedding: 0,
      reception: 0,
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

  const eventColors = {
    haldi: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-900",
      hover: "hover:bg-amber-100",
      selected: "bg-amber-100",
      icon: Sun,
      title: "Haldi",
      gradient: "from-amber-400/10 to-amber-600/10",
      gradientSelected: "from-amber-400/20 to-amber-600/20",
    },
    sangeet: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-900",
      hover: "hover:bg-rose-100",
      selected: "bg-rose-100",
      icon: Music,
      title: "Sangeet",
      gradient: "from-rose-400/10 to-rose-600/10",
      gradientSelected: "from-rose-400/20 to-rose-600/20",
    },
    wedding: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-900",
      hover: "hover:bg-red-100",
      selected: "bg-red-100",
      icon: MapPin,
      title: "Wedding",
      gradient: "from-red-400/10 to-red-600/10",
      gradientSelected: "from-red-400/20 to-red-600/20",
    },
    reception: {
      bg: "bg-pink-50",
      border: "border-pink-100",
      text: "text-pink-900",
      hover: "hover:bg-pink-100",
      selected: "bg-pink-100",
      icon: PartyPopper,
      title: "Reception",
      gradient: "from-pink-400/10 to-pink-600/10",
      gradientSelected: "from-pink-400/20 to-pink-600/20",
    },
    coloradoReception: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-900",
      hover: "hover:bg-purple-100",
      selected: "bg-purple-100",
      icon: PartyPopper,
      title: "Colorado Reception",
      gradient: "from-purple-400/10 to-purple-600/10",
      gradientSelected: "from-purple-400/20 to-purple-600/20",
    },
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-6">
        {isLoading ? (
          // Loading skeleton for stats section
          <div className="bg-white shadow rounded-xl p-4 sm:p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`loading-stat-${index}`}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                RSVP Overview
              </h2>
              {selectedEvent && (
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Summary Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full lg:col-span-1 bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 sm:p-6 border border-amber-100"
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-amber-600" />
                      <h3 className="text-sm font-medium text-amber-900">
                        Total Responses
                      </h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900">
                      {selectedEvent
                        ? filteredResponses.length
                        : responses.length}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-amber-600" />
                      <h3 className="text-sm font-medium text-amber-900">
                        Total Guests
                      </h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900">
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
                      (total, r) =>
                        total + 1 + (Number(r.additional_guests) || 0),
                      0
                    );

                  return (
                    <motion.button
                      key={key}
                      onClick={() => setSelectedEvent(isSelected ? null : key)}
                      className={`relative overflow-hidden rounded-lg p-4 border transition-all duration-300 ${
                        event.border
                      } ${event.bg} ${!isSelected && event.hover}`}
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
                            <EventIcon className={`h-4 w-4 ${event.text}`} />
                            <h3 className={`text-sm font-medium ${event.text}`}>
                              {event.title}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <p className={`text-2xl font-bold ${event.text}`}>
                              {guestCount}
                            </p>
                            <p
                              className={`text-xs font-medium opacity-80 ${event.text}`}
                            >
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
          </div>
        )}
      </div>

      {/* Responses Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedEvent
              ? `${
                  eventColors[selectedEvent as keyof typeof eventColors].title
                } Responses`
              : "RSVP Responses"}
          </h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-500">Loading responses...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filteredResponses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {selectedEvent
              ? "No responses for this event yet."
              : "No responses yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Additional Guests
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Response Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response) => (
                  <tr
                    key={`response-${response.id}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {response.name}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {response.email}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {response.phone}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {response.additional_guests > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          +{response.additional_guests}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {response?.events &&
                          Object.entries(response.events)
                            .filter(([, isAttending]) => isAttending)
                            .map(([event]) => (
                              <span
                                key={`${response.id}-${event}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                              >
                                {event.charAt(0).toUpperCase() + event.slice(1)}
                              </span>
                            ))}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(response.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
