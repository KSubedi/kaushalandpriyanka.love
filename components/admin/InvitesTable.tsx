"use client";

import { Invite } from "@/utils/interfaces/InviteType";
import { Copy, Check, Trash, Edit, ExternalLink, Filter } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

interface InvitesTableProps {
  invites: Invite[];
  onCopyInvite: (id: string) => void;
  onDeleteInvite: (id: string) => void;
  onEditInvite: (invite: Invite) => void;
  copiedId: string | null;
  title: string;
  showPendingOnly?: boolean;
  onToggleFilter?: () => void;
}

export function InvitesTable({
  invites,
  onCopyInvite,
  onDeleteInvite,
  onEditInvite,
  copiedId,
  title,
  showPendingOnly = false,
  onToggleFilter,
}: InvitesTableProps) {
  useEffect(() => {
    console.log("InvitesTable rendered with", invites.length, "invites");
    console.log(
      "Invites array type:",
      Array.isArray(invites) ? "Array" : typeof invites
    );

    if (invites.length > 0) {
      console.log("First invite:", JSON.stringify(invites[0], null, 2));
      console.log("First invite events:", invites[0]?.events);
      console.log("First invite is_template:", invites[0]?.is_template);
    } else {
      console.log("No invites available to display");
    }
  }, [invites]);

  // Filter invites to show only pending ones if the filter is active
  const displayedInvites = showPendingOnly
    ? invites.filter((invite) => !invite.response)
    : invites;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">
            Showing {displayedInvites.length}{" "}
            {displayedInvites.length === 1 ? "invite" : "invites"}
            {showPendingOnly ? " (pending only)" : ""}
          </p>
        </div>
        {onToggleFilter && !invites[0]?.is_template && (
          <button
            onClick={onToggleFilter}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              showPendingOnly
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title={
              showPendingOnly ? "Show all invites" : "Show only pending invites"
            }
          >
            <Filter className="h-4 w-4" />
            {showPendingOnly ? "Show All" : "Show Pending Only"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                {invites[0]?.is_template ? "Template Name" : "Guest Info"}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Events
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedInvites.map((invite) => (
              <tr key={invite.id} className="border-b border-gray-200">
                <td className="px-3 py-3">
                  {invite.is_template ? (
                    <div className="text-sm font-medium text-gray-900">
                      {invite.template_name || "Unnamed Template"}
                    </div>
                  ) : invite.name || invite.email || invite.phone ? (
                    <div className="space-y-1">
                      {invite.name && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-900">
                            {invite.name}
                          </span>
                        </div>
                      )}
                      {invite.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          {invite.email}
                        </div>
                      )}
                      {invite.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          {invite.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No contact info</div>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {invite.events.haldi && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Haldi
                      </span>
                    )}
                    {invite.events.sangeet && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        Sangeet
                      </span>
                    )}
                    {invite.events.wedding && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Wedding
                      </span>
                    )}
                    {invite.events.reception && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Reception
                      </span>
                    )}
                    {invite.events.coloradoReception && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Colorado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {format(new Date(invite.created_at), "MMM d, yyyy")}
                </td>
                <td className="px-3 py-3">
                  {invite.response ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Responded
                    </span>
                  ) : invite.is_template ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Template
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-sm font-medium">
                  <div className="flex flex-col space-y-2 relative z-10">
                    <button
                      onClick={() => {
                        console.log(
                          "Edit button clicked for invite:",
                          invite.id
                        );
                        onEditInvite(invite);
                      }}
                      className="flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors shadow-sm"
                      style={{ minWidth: "80px" }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          console.log(
                            "Copy button clicked for invite:",
                            invite.id
                          );
                          onCopyInvite(invite.id);
                        }}
                        className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        style={{ minWidth: "30px" }}
                        title="Copy invite link"
                      >
                        {copiedId === invite.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>

                      <a
                        href={`/invite/${invite.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors shadow-sm"
                        style={{ minWidth: "30px" }}
                        title="Open invite"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={() => {
                          console.log(
                            "Delete button clicked for invite:",
                            invite.id
                          );
                          onDeleteInvite(invite.id);
                        }}
                        className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors shadow-sm"
                        style={{ minWidth: "30px" }}
                        title="Delete invite"
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
