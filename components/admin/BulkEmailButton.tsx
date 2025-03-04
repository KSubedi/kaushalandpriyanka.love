import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InviteResponse } from "@/utils/interfaces/InviteType";

interface BulkEmailButtonProps {
  responses: InviteResponse[];
  onComplete: () => void;
}

export function BulkEmailButton({
  responses,
  onComplete,
}: BulkEmailButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0, failed: 0 });

  const handleSendBulkEmails = async () => {
    // Filter responses that haven't received a welcome email yet
    const pendingResponses = responses.filter(
      (response) => !response.welcome_email_sent && response.email
    );

    if (pendingResponses.length === 0) {
      toast.info("No pending confirmation emails to send");
      return;
    }

    const confirmSend = window.confirm(
      `Are you sure you want to send confirmation emails to ${pendingResponses.length} recipients? This will be throttled at 2 emails per second.`
    );

    if (!confirmSend) return;

    setIsProcessing(true);
    setProgress({ sent: 0, total: pendingResponses.length, failed: 0 });

    // Process emails with throttling (2 per second)
    const sendEmailWithThrottling = async () => {
      let currentIndex = 0;
      let failedCount = 0;

      const processNext = async () => {
        if (currentIndex >= pendingResponses.length) {
          // All done
          setIsProcessing(false);
          toast.success(
            `Completed sending ${
              pendingResponses.length - failedCount
            } confirmation emails${
              failedCount > 0 ? ` (${failedCount} failed)` : ""
            }`
          );
          onComplete();
          return;
        }

        // Process up to 2 emails at once
        const batch = pendingResponses.slice(currentIndex, currentIndex + 2);
        currentIndex += 2;

        const batchPromises = batch.map(async (response) => {
          try {
            // Use the existing confirmation email endpoint
            const result = await fetch(
              "/api/admin/responses/send-confirmation",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ responseId: response.id }),
              }
            );

            if (!result.ok) {
              console.error(
                `Failed to send confirmation email to ${response.email}:`,
                await result.text()
              );
              failedCount++;
              return false;
            }
            return true;
          } catch (error) {
            console.error(
              `Error sending confirmation email to ${response.email}:`,
              error
            );
            failedCount++;
            return false;
          }
        });

        await Promise.all(batchPromises);

        // Update progress
        setProgress((prev) => ({
          ...prev,
          sent: Math.min(currentIndex, pendingResponses.length),
          failed: failedCount,
        }));

        // Wait 1 second before processing the next batch (2 emails per second)
        setTimeout(processNext, 1000);
      };

      // Start processing
      await processNext();
    };

    // Start the throttled sending process
    sendEmailWithThrottling();
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleSendBulkEmails}
        disabled={isProcessing}
        className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
          isProcessing
            ? "bg-purple-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        } transition-colors`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending Emails ({progress.sent}/{progress.total})
            {progress.failed > 0 && ` (${progress.failed} failed)`}
          </>
        ) : (
          <>
            <Mail className="h-4 w-4 mr-2" />
            Send Confirmation Emails to All Pending Responses
          </>
        )}
      </button>
      {isProcessing && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{
                width: `${Math.round((progress.sent / progress.total) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Throttling: 2 emails per second to avoid rate limits
          </p>
        </div>
      )}
    </div>
  );
}
