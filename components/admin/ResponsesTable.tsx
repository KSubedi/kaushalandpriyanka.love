"use client";

import { InviteResponse } from "@/utils/interfaces/InviteType";
import { format } from "date-fns";
import { Edit, Trash, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ResponsesTableProps {
  responses: InviteResponse[];
  onEditResponse: (response: InviteResponse) => void;
  onDeleteResponse: (id: string) => void;
}

export function ResponsesTable({
  responses,
  onEditResponse,
  onDeleteResponse,
}: ResponsesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyInviteLink = async (inviteId: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/${inviteId}`
      );
      setCopiedId(inviteId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No responses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Name
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Email
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Additional Guests
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Events
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Response Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((response) => (
              <tr
                key={`response-${response.id}`}
                className="border-b border-gray-200"
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      +{response.additional_guests}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {response.events.haldi && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Haldi
                      </span>
                    )}
                    {response.events.sangeet && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        Sangeet
                      </span>
                    )}
                    {response.events.wedding && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Wedding
                      </span>
                    )}
                    {response.events.reception && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Reception
                      </span>
                    )}
                    {response.events.coloradoReception && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Colorado
                      </span>
                    )}
                  </div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(response.created_at), "MMM d, yyyy")}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <button
                      onClick={() => {
                        console.log(
                          "Edit button clicked for response:",
                          response.id
                        );
                        onEditResponse(response);
                      }}
                      className="flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm"
                      title="Edit response"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyInviteLink(response.inviteId)}
                        className="flex items-center justify-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        title="Copy invite link"
                      >
                        {copiedId === response.inviteId ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>

                      <a
                        href={`/invite/${response.inviteId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        title="Open invite"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={() => {
                          console.log(
                            "Delete button clicked for response:",
                            response.id
                          );
                          onDeleteResponse(response.id);
                        }}
                        className="flex items-center justify-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors shadow-sm"
                        title="Delete response"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
