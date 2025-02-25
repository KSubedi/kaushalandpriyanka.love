"use client";

import { Invite, InviteResponse } from "@/utils/interfaces/InviteType";
import { useEffect, useState } from "react";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { ResponsesTable } from "@/components/admin/ResponsesTable";
import { InvitesTable } from "@/components/admin/InvitesTable";
import { InviteForm } from "@/components/admin/InviteForm";
import { EditInviteForm } from "@/components/admin/EditInviteForm";
import { useSearchParams, useRouter } from "next/navigation";
import { MigrationButton } from "@/components/admin/MigrationButton";
import { EditResponseForm } from "@/components/admin/EditResponseForm";

interface InviteFormData {
  name: string;
  email: string;
  phone: string;
  additional_guests: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
    coloradoReception: boolean;
  };
  is_template: boolean;
  location: "houston" | "colorado" | "";
  template_name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    return tabParam &&
      ["overview", "responses", "invites", "templates"].includes(tabParam)
      ? tabParam
      : "overview";
  });
  const [responses, setResponses] = useState<InviteResponse[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(true);
  const [isLoadingInvites, setIsLoadingInvites] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editInvite, setEditInvite] = useState<Invite | null>(null);
  const [isTemplateEdit, setIsTemplateEdit] = useState(false);
  const [editResponse, setEditResponse] = useState<InviteResponse | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(true);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`, { scroll: false });
  };

  // Toggle pending filter
  const togglePendingFilter = () => {
    setShowPendingOnly(!showPendingOnly);
  };

  // Fetch responses
  const fetchResponses = async () => {
    setIsLoadingResponses(true);
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
      setIsLoadingResponses(false);
    }
  };

  // Fetch invites
  const fetchInvites = async () => {
    setIsLoadingInvites(true);
    setError(null);
    console.log("Admin page: Starting to fetch invites");
    try {
      const response = await fetch("/api/admin/invites");
      console.log(
        "Admin page: Fetch invites response status:",
        response.status
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invites");
      }

      const data = await response.json();
      console.log(
        `Admin page: Received ${data.invites?.length || 0} invites from API`
      );

      if (data.invites && Array.isArray(data.invites)) {
        setInvites(data.invites);
      } else {
        console.error("Admin page: Invalid invites data format:", data);
        setError("Received invalid data format from server");
      }
    } catch (err) {
      console.error("Admin page: Error fetching invites:", err);
      setError(err instanceof Error ? err.message : "Failed to load invites");
    } finally {
      setIsLoadingInvites(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchResponses();
    fetchInvites();
  }, []);

  // Filter responses based on selected event
  const filteredResponses = selectedEvent
    ? responses.filter(
        (response) =>
          response.events[selectedEvent as keyof typeof response.events]
      )
    : responses;

  // Handle copying invite link
  const handleCopyInvite = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/${id}`
      );
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle deleting an invite
  const handleDeleteInvite = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invite?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invites/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete invite");
      }

      // Refresh invites list
      fetchInvites();
    } catch (err) {
      console.error("Error deleting invite:", err);
      alert(err instanceof Error ? err.message : "Failed to delete invite");
    }
  };

  // Handle editing an invite
  const handleEditInvite = (invite: Invite) => {
    setEditInvite(invite);
    setIsTemplateEdit(!!invite.is_template);
  };

  // Handle submitting edited invite
  const handleSubmitEdit = async (formData: InviteResponse | Invite) => {
    try {
      const response = await fetch(`/api/admin/invites/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update invite");
      }

      // Refresh data
      fetchInvites();
      fetchResponses();

      // Close edit form
      setEditInvite(null);
    } catch (err) {
      console.error("Error updating invite:", err);
      throw err; // Re-throw the error to be handled by the EditInviteForm component
    }
  };

  // Handle generating a new invite
  const handleGenerateInvite = async (formData: InviteFormData) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate invite");
      }

      // Refresh invites list
      fetchInvites();
    } catch (err) {
      console.error("Error generating invite:", err);
      alert(err instanceof Error ? err.message : "Failed to generate invite");
    } finally {
      setIsGenerating(false);
    }
  };

  // Separate invites into templates and regular invites
  const templateInvites = invites.filter((invite) => invite.is_template);
  const regularInvites = invites.filter((invite) => !invite.is_template);

  // Handle editing a response
  const handleEditResponse = (response: InviteResponse) => {
    setEditResponse(response);
  };

  // Handle deleting a response
  const handleDeleteResponse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this response?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/responses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete response");
      }

      // Refresh responses list
      fetchResponses();
    } catch (err) {
      console.error("Error deleting response:", err);
      alert(err instanceof Error ? err.message : "Failed to delete response");
    }
  };

  // Handle submitting edited response
  const handleSubmitResponseEdit = async (formData: InviteResponse) => {
    try {
      const response = await fetch(`/api/admin/responses/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update response");
      }

      // Refresh data
      fetchResponses();

      // Close edit form
      setEditResponse(null);
    } catch (err) {
      console.error("Error updating response:", err);
      throw err; // Re-throw the error to be handled by the EditResponseForm component
    }
  };

  // Loading state
  if (isLoadingResponses && isLoadingInvites) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-6">
        <p className="font-medium">Error loading data</p>
        <p className="mt-1">{error}</p>
        <button
          onClick={() => {
            fetchResponses();
            fetchInvites();
          }}
          className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <StatsOverview
            responses={responses}
            onEventSelect={setSelectedEvent}
            selectedEvent={selectedEvent}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Database Management
            </h2>
            <MigrationButton />
          </div>
        </div>
      )}

      {/* Responses Tab */}
      {activeTab === "responses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedEvent
                ? `Responses for ${
                    selectedEvent.charAt(0).toUpperCase() +
                    selectedEvent.slice(1)
                  }`
                : "All Responses"}
            </h2>
            <div className="flex space-x-2">
              {Object.keys(responses[0]?.events || {}).map((event) => (
                <button
                  key={event}
                  onClick={() =>
                    setSelectedEvent(selectedEvent === event ? null : event)
                  }
                  className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                    selectedEvent === event
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {event.charAt(0).toUpperCase() + event.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsesTable
            responses={filteredResponses}
            onEditResponse={handleEditResponse}
            onDeleteResponse={handleDeleteResponse}
          />
        </div>
      )}

      {/* Invites Tab */}
      {activeTab === "invites" && (
        <div className="space-y-6">
          <InviteForm
            onSubmit={handleGenerateInvite}
            isGenerating={isGenerating}
          />

          <InvitesTable
            invites={regularInvites}
            onCopyInvite={handleCopyInvite}
            onDeleteInvite={handleDeleteInvite}
            onEditInvite={handleEditInvite}
            copiedId={copiedId}
            title="Active Invites"
            showPendingOnly={showPendingOnly}
            onToggleFilter={togglePendingFilter}
          />
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <InviteForm
            onSubmit={handleGenerateInvite}
            isGenerating={isGenerating}
          />

          <InvitesTable
            invites={templateInvites}
            onCopyInvite={handleCopyInvite}
            onDeleteInvite={handleDeleteInvite}
            onEditInvite={handleEditInvite}
            copiedId={copiedId}
            title="Invite Templates"
          />
        </div>
      )}

      {/* Edit Form Modals */}
      {editInvite && (
        <EditInviteForm
          invite={editInvite}
          onClose={() => setEditInvite(null)}
          onSubmit={handleSubmitEdit}
          isTemplate={isTemplateEdit}
        />
      )}

      {editResponse && (
        <EditResponseForm
          response={editResponse}
          onClose={() => setEditResponse(null)}
          onSubmit={handleSubmitResponseEdit}
        />
      )}
    </div>
  );
}
