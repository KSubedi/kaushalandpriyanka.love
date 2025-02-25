"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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

interface InviteFormProps {
  onSubmit: (formData: InviteFormData) => Promise<void>;
  isGenerating: boolean;
}

export function InviteForm({ onSubmit, isGenerating }: InviteFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<InviteFormData>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (name.startsWith("event_")) {
        const eventName = name.replace("event_", "");
        setFormData((prev) => ({
          ...prev,
          events: {
            ...prev.events,
            [eventName]: isChecked,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: isChecked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setShowForm(false);
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
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Generate New Invite</span>
        </button>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generate New Invite
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
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
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
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
                  value={formData.additional_guests}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="Enter number of additional guests"
                />
              </div>
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
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
              >
                <option value="">Select Location</option>
                <option value="houston">Houston Events</option>
                <option value="colorado">Colorado Reception</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_template"
                id="is_template"
                checked={formData.is_template}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                  RSVP will create a new unique invite while keeping track of
                  all responses.
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
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                  placeholder="Enter a name for this template"
                  required={formData.is_template}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Give this template a descriptive name to help you identify it
                  later
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
                  if (
                    (formData.location === "houston" &&
                      event === "coloradoReception") ||
                    (formData.location === "colorado" &&
                      event !== "coloradoReception")
                  ) {
                    return null;
                  }

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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-red-500 rounded-lg hover:from-blue-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                ) : (
                  "Generate Invite"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
