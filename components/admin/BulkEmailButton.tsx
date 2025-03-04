import { useState } from "react";
import { Mail, Loader2, AlertTriangle } from "lucide-react";
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
  const [isTestMode, setIsTestMode] = useState(false);
  const [bypassSentCheck, setBypassSentCheck] = useState(false);

  const handleSendBulkEmails = async (testMode: boolean = false) => {
    setIsTestMode(testMode);

    // Filter responses based on bypass setting
    let pendingResponses = bypassSentCheck
      ? responses.filter((response) => response.email)
      : responses.filter(
          (response) => !response.welcome_email_sent && response.email
        );

    if (testMode) {
      // In test mode, only send to kaushal@wireshock.com or use the first response
      // and modify it for testing
      const testResponse =
        pendingResponses.find(
          (response) => response.email === "kaushal@wireshock.com"
        ) ||
        (pendingResponses.length > 0
          ? { ...pendingResponses[0], email: "kaushal@wireshock.com" }
          : null);

      if (!testResponse) {
        toast.error("No pending responses available for test");
        return;
      }

      pendingResponses = [testResponse];
      toast.info("Test mode: Only sending to kaushal@wireshock.com");
    } else if (pendingResponses.length === 0) {
      toast.info(
        bypassSentCheck
          ? "No responses available to send emails to"
          : "No pending confirmation emails to send"
      );
      return;
    }

    const confirmMessage = testMode
      ? "Are you sure you want to run a test? This will only send to kaushal@wireshock.com."
      : bypassSentCheck
      ? `Are you sure you want to resend confirmation emails to ${pendingResponses.length} recipients, including those who already received emails? This will be throttled at 2 emails per second.`
      : `Are you sure you want to send confirmation emails to ${pendingResponses.length} recipients? This will be throttled at 2 emails per second.`;

    const confirmSend = window.confirm(confirmMessage);

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
                body: JSON.stringify({
                  responseId: response.id,
                  testMode: testMode,
                  bypassSentCheck: bypassSentCheck,
                }),
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
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <button
          onClick={() => handleSendBulkEmails(false)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
            isProcessing
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } transition-colors`}
        >
          {isProcessing && !isTestMode ? (
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

        <button
          onClick={() => handleSendBulkEmails(true)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
            isProcessing
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-500 hover:bg-amber-600"
          } transition-colors`}
        >
          {isProcessing && isTestMode ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing ({progress.sent}/{progress.total})
              {progress.failed > 0 && ` (${progress.failed} failed)`}
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Test Run (kaushal@wireshock.com only)
            </>
          )}
        </button>
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="bypassSentCheck"
          checked={bypassSentCheck}
          onChange={(e) => setBypassSentCheck(e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          disabled={isProcessing}
        />
        <label
          htmlFor="bypassSentCheck"
          className="ml-2 block text-sm text-gray-700"
        >
          Bypass sent check (resend to all responses, even if they already
          received an email)
        </label>
      </div>

      {isProcessing && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                isTestMode ? "bg-amber-500" : "bg-purple-600"
              }`}
              style={{
                width: `${Math.round((progress.sent / progress.total) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isTestMode
              ? "Test mode: Only sending to kaushal@wireshock.com"
              : "Throttling: 2 emails per second to avoid rate limits"}
          </p>
        </div>
      )}
    </div>
  );
}
