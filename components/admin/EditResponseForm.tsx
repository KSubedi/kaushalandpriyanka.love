"use client";

import { InviteResponse } from "@/utils/interfaces/InviteType";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditResponseFormProps {
  response: InviteResponse | null;
  onClose: () => void;
  onSubmit: (formData: InviteResponse) => Promise<void>;
}

export function EditResponseForm({
  response,
  onClose,
  onSubmit,
}: EditResponseFormProps) {
  const [formData, setFormData] = useState<InviteResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (response) {
      setFormData(response);
    }
  }, [response]);

  if (!formData) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (name.startsWith("event_")) {
        const eventName = name.replace("event_", "");
        setFormData((prev) => ({
          ...prev!,
          events: {
            ...prev!.events,
            [eventName]: isChecked,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev!,
          [name]: isChecked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev!,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success("Response updated successfully");
    } catch (error) {
      toast.error("Failed to update response");
      console.error("Error updating response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Response</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              value={formData.name || ""}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="Enter guest name"
              disabled={isSubmitting}
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
              value={formData.email || ""}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="Enter guest email"
              disabled={isSubmitting}
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
              value={formData.phone || ""}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="Enter guest phone"
              disabled={isSubmitting}
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
              value={formData.additional_guests || 0}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="Enter number of additional guests"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Events
            </label>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              {Object.entries(formData.events).map(([event, checked]) => (
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
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-900">
                    {event === "coloradoReception"
                      ? "Colorado Reception"
                      : event.charAt(0).toUpperCase() + event.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-red-500 rounded-lg hover:from-blue-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
