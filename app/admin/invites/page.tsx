"use client";

import { useEffect, useState } from "react";
import { Invite, InviteResponse } from "@/utils/interfaces/InviteType";
import { Copy, Check, Plus, Trash, Edit } from "lucide-react";

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<InviteResponse | null>(null);
  const [editTemplateData, setEditTemplateData] = useState<Invite | null>(null);
  const [showEditTemplateForm, setShowEditTemplateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    additional_guests: 5,
    events: {
      haldi: false,
      sangeet: false,
      wedding: false,
      reception: false,
      coloradoReception: false,
    },
    is_template: false,
    location: "houston" as "houston" | "colorado" | "",
    template_name: "",
  });

  const fetchInvites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/invites");
      if (!response.ok) {
        throw new Error("Failed to fetch invites");
      }
      const data = await response.json();
      setInvites(data.invites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const copyInviteLink = async (id: string) => {
    const link = `${window.location.origin}/invite/${id}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    try {
      console.log("Generating invite with data:", formData);
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invite");
      }

      console.log("Generated invite:", data.invite);

      // Update the invites list with the new invite
      setInvites((prevInvites) => [data.invite, ...prevInvites]);

      // Close the form and reset
      setShowGenerateForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        additional_guests: 5,
        events: {
          haldi: false,
          sangeet: false,
          wedding: false,
          reception: false,
          coloradoReception: false,
        },
        is_template: false,
        location: "houston",
        template_name: "",
      });
    } catch (err) {
      console.error("Error generating invite:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate invite"
      );
      // Keep the form open if there's an error
      setShowGenerateForm(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value as "houston" | "colorado" | "";
    setFormData((prev) => ({
      ...prev,
      location,
      events: {
        haldi: location === "houston" ? prev.events.haldi : false,
        sangeet: location === "houston" ? prev.events.sangeet : false,
        wedding: location === "houston" ? prev.events.wedding : false,
        reception: location === "houston" ? prev.events.reception : false,
        coloradoReception: location === "colorado" ? true : false,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name === "is_template") {
        setFormData((prev) => ({
          ...prev,
          is_template: checkbox.checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          events: {
            ...prev.events,
            [name.replace("event_", "")]: checkbox.checked,
          },
        }));
      }
    } else if (name === "location") {
      handleLocationChange(e as React.ChangeEvent<HTMLSelectElement>);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this invite? This action cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/invites/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete invite");
      }
      setInvites((prev) => prev.filter((invite) => invite.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete invite"
      );
    }
  };

  const handleEdit = (invite: Invite) => {
    console.log("handleEdit called with:", invite);
    if (invite.is_template) {
      setEditTemplateData(invite);
      setShowEditTemplateForm(true);
    } else if (invite.response) {
      setEditFormData(invite.response);
      setShowEditForm(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/responses/${editFormData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update response");
      }

      // Refresh invites after successful update
      fetchInvites();
      setShowEditForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!editFormData) return;
    setEditFormData((prev) => ({ ...prev!, [name]: value }));
  };

  const handleEventChange = (event: string, checked: boolean) => {
    if (!editFormData) return;
    setEditFormData((prev) => ({
      ...prev!,
      events: {
        ...prev!.events,
        [event]: checked,
      },
    }));
  };

  const handleEditTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplateData) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/invites/${editTemplateData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTemplateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      // Refresh invites after successful update
      fetchInvites();
      setShowEditTemplateForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update template"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (!editTemplateData) return;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name === "is_template") {
        setEditTemplateData((prev) => ({
          ...prev!,
          is_template: checkbox.checked,
        }));
      } else {
        setEditTemplateData((prev) => ({
          ...prev!,
          events: {
            ...prev!.events,
            [name.replace("event_", "")]: checkbox.checked,
          },
        }));
      }
    } else {
      setEditTemplateData((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const renderInvitesTable = (invites: Invite[], title: string) => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {invites[0]?.is_template ? "Template Name" : "Guest Info"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
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
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-14">Email:</span>
                          <span className="text-gray-700 ml-2">
                            {invite.email}
                          </span>
                        </div>
                      )}
                      {invite.phone && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-14">Phone:</span>
                          <span className="text-gray-700 ml-2">
                            {invite.phone}
                          </span>
                        </div>
                      )}
                      {typeof invite.additional_guests === "number" &&
                        invite.additional_guests > 0 && (
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-14">Guests:</span>
                            <span className="text-gray-700 ml-2">
                              +{invite.additional_guests}
                            </span>
                          </div>
                        )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">
                      No pre-filled info
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(invite.events)
                      .filter(([, isIncluded]) => isIncluded)
                      .map(([event]) => (
                        <span
                          key={`${invite.id}-${event}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                        >
                          {event.charAt(0).toUpperCase() + event.slice(1)}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(invite.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {invite.is_template ? (
                      <>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Template
                        </span>
                        <div className="text-sm text-gray-600">
                          {invite.responses?.length || 0} responses
                        </div>
                      </>
                    ) : invite.template_invite_id ? (
                      <>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Response
                        </span>
                        {invite.response ? (
                          <div className="text-sm text-green-600">
                            Submitted
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">Pending</div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Single Use
                        </span>
                        {invite.response ? (
                          <div className="text-sm text-green-600">
                            Responded
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">Pending</div>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyInviteLink(invite.id)}
                      className="inline-flex flex-1 justify-center items-center px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors text-nowrap"
                    >
                      {copiedId === invite.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1.5" />
                          Copy Link
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(invite)}
                      className="inline-flex flex-1 justify-center items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invite.id)}
                      className="inline-flex flex-1 justify-center items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash className="h-4 w-4 mr-1.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Invites</h1>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-500 text-white font-medium hover:from-amber-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate New Invite
        </button>
      </div>

      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Generate New Invite
              </h2>
              <button
                onClick={() => setShowGenerateForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest phone"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Location
                  </label>
                  <select
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                  >
                    <option value="">Select Location</option>
                    <option value="houston">Houston Events</option>
                    <option value="colorado">Colorado Reception</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Select the location to determine the name order and event
                    details
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_template"
                    id="is_template"
                    checked={formData.is_template}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label
                    htmlFor="is_template"
                    className="text-sm font-medium text-gray-900"
                  >
                    Make this a reusable invite template
                  </label>
                  <div className="group relative">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ?
                    </button>
                    <div className="absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 transform rounded-lg bg-gray-900 p-2 text-xs text-white group-hover:block">
                      When enabled, this invite can be used multiple times. Each
                      RSVP will create a new unique invite while keeping track
                      of all responses.
                    </div>
                  </div>
                </div>

                {formData.is_template && (
                  <div>
                    <label
                      htmlFor="template_name"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Template Name
                    </label>
                    <input
                      type="text"
                      name="template_name"
                      id="template_name"
                      value={formData.template_name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                      placeholder="Enter a name for this template"
                      required={formData.is_template}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Give this template a descriptive name to help you identify
                      it later
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Events
                  </label>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {Object.entries(formData.events).map(([event, checked]) => {
                      // Only show houston events for houston location and colorado events for colorado location
                      const shouldShow =
                        (formData.location === "houston" &&
                          event !== "coloradoReception") ||
                        (formData.location === "colorado" &&
                          event === "coloradoReception");

                      if (!shouldShow) return null;

                      return (
                        <label
                          key={event}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name={`event_${event}`}
                            checked={checked}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-900">
                            {event === "coloradoReception"
                              ? "Colorado Reception"
                              : event.charAt(0).toUpperCase() + event.slice(1)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="additional_guests"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Total People Allowed
                  </label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Selected: {formData.additional_guests + 1} people
                      </span>
                    </div>
                    <input
                      type="range"
                      name="additional_guests"
                      id="additional_guests"
                      value={formData.additional_guests}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          additional_guests: value,
                        }));
                      }}
                      min="0"
                      max="5"
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Just them</span>
                      <span>Them + 5 guests</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Set the maximum number of people allowed for this invite
                    (including the invitee)
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-red-500 rounded-lg hover:from-amber-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Response
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter guest phone"
                  />
                </div>

                <div>
                  <label
                    htmlFor="additional_guests"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Additional Guests
                  </label>
                  <input
                    type="number"
                    name="additional_guests"
                    id="additional_guests"
                    value={editFormData.additional_guests}
                    onChange={handleEditChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter number of additional guests"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Events
                  </label>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {Object.entries(editFormData.events).map(
                      ([event, checked]) => (
                        <label
                          key={event}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name={`event_${event}`}
                            checked={checked}
                            onChange={(e) =>
                              handleEventChange(event, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-900">
                            {event.charAt(0).toUpperCase() + event.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-red-500 rounded-lg hover:from-amber-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditTemplateForm && editTemplateData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Template
              </h2>
              <button
                onClick={() => setShowEditTemplateForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleEditTemplateSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="template_name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Template Name
                  </label>
                  <input
                    type="text"
                    name="template_name"
                    id="template_name"
                    value={editTemplateData.template_name || ""}
                    onChange={handleTemplateChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Location
                  </label>
                  <select
                    name="location"
                    id="location"
                    value={editTemplateData.location || ""}
                    onChange={handleTemplateChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 sm:text-sm"
                  >
                    <option value="">Select Location</option>
                    <option value="houston">Houston Events</option>
                    <option value="colorado">Colorado Reception</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Events
                  </label>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {Object.entries(editTemplateData.events).map(
                      ([event, checked]) => (
                        <label
                          key={event}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name={`event_${event}`}
                            checked={checked}
                            onChange={handleTemplateChange}
                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-900">
                            {event.charAt(0).toUpperCase() + event.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditTemplateForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-red-500 rounded-lg hover:from-amber-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-500">Loading invites...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : invites.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No invites generated yet.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Template Invites Section */}
          {invites.some((invite) => invite.is_template) &&
            renderInvitesTable(
              invites.filter((invite) => invite.is_template),
              "Template Invites"
            )}

          {/* Individual Invites Section */}
          {renderInvitesTable(
            invites.filter((invite) => !invite.is_template),
            "Individual Invites"
          )}
        </div>
      )}
    </div>
  );
}
