"use client";

import { InviteResponse } from "@/utils/interfaces/InviteType";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function AdminDashboard() {
  const [responses, setResponses] = useState<InviteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              RSVP Overview
            </h2>
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
                      {responses.length}
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
                      {stats.totalGuests}
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
                {/* Haldi Stats */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex flex-col h-full">
                    <h3 className="text-amber-900 text-sm font-medium mb-1">
                      Haldi
                    </h3>
                    <div className="flex items-end justify-between mt-2">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-amber-700">
                          {stats.haldi}
                        </p>
                        <p className="text-xs font-medium text-amber-600">
                          Confirmed Guests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sangeet Stats */}
                <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
                  <div className="flex flex-col h-full">
                    <h3 className="text-rose-900 text-sm font-medium mb-1">
                      Sangeet
                    </h3>
                    <div className="flex items-end justify-between mt-2">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-rose-700">
                          {stats.sangeet}
                        </p>
                        <p className="text-xs font-medium text-rose-600">
                          Confirmed Guests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wedding Stats */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <div className="flex flex-col h-full">
                    <h3 className="text-red-900 text-sm font-medium mb-1">
                      Wedding
                    </h3>
                    <div className="flex items-end justify-between mt-2">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-red-700">
                          {stats.wedding}
                        </p>
                        <p className="text-xs font-medium text-red-600">
                          Confirmed Guests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reception Stats */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <div className="flex flex-col h-full">
                    <h3 className="text-pink-900 text-sm font-medium mb-1">
                      Reception
                    </h3>
                    <div className="flex items-end justify-between mt-2">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-pink-700">
                          {stats.reception}
                        </p>
                        <p className="text-xs font-medium text-pink-600">
                          Confirmed Guests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Responses Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            RSVP Responses
          </h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-500">Loading responses...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : responses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No responses yet.</div>
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
                {responses.map((response) => (
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
