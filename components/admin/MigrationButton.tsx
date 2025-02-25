"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Database,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MigrationStats {
  invites: number;
  responses: number;
  errors: number;
  skipped: number;
}

export function MigrationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(
    null
  );
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);
  const [migrationSuccess, setMigrationSuccess] = useState<boolean | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMigration = async () => {
    if (isLoading) return;

    const confirmed = window.confirm(
      "Are you sure you want to migrate data from Cloudflare KV to PostgreSQL? This operation will preserve existing data and skip duplicates."
    );

    if (!confirmed) return;

    setIsLoading(true);
    setMigrationComplete(false);
    setMigrationStats(null);
    setMigrationMessage(null);
    setMigrationSuccess(null);

    try {
      const response = await fetch("/api/admin/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Migration completed successfully");
        setMigrationSuccess(true);
      } else {
        toast.error(`Migration failed: ${data.message}`);
        setMigrationSuccess(false);
      }

      setMigrationStats(data.stats);
      setMigrationMessage(data.message);
      setMigrationComplete(true);
      setIsExpanded(true); // Auto-expand to show results
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Migration failed. Please check the console for details.");
      setMigrationSuccess(false);
      setMigrationMessage(
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="w-full">
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Migration
          </CardTitle>
          <CardDescription>
            Migrate data from Cloudflare KV to PostgreSQL database
          </CardDescription>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent>
            {!migrationComplete && !isLoading && (
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to migrate all invites and responses from
                Cloudflare KV to PostgreSQL. This operation will skip duplicates
                and preserve all existing data and relationships.
              </p>
            )}

            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Migration in progress...</p>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            )}

            {migrationComplete && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {migrationSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p className="text-sm font-medium">
                    {migrationSuccess
                      ? "Migration completed"
                      : "Migration failed"}
                  </p>
                </div>

                {migrationMessage && (
                  <p className="text-sm text-muted-foreground">
                    {migrationMessage}
                  </p>
                )}

                {migrationStats && (
                  <div className="grid grid-cols-4 gap-4 pt-2">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Invites</p>
                      <p className="text-lg font-bold">
                        {migrationStats.invites}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Responses</p>
                      <p className="text-lg font-bold">
                        {migrationStats.responses}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Skipped</p>
                      <p className="text-lg font-bold">
                        {migrationStats.skipped}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Errors</p>
                      <p className="text-lg font-bold">
                        {migrationStats.errors}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleMigration}
              disabled={isLoading}
              className="w-full"
              variant={
                migrationComplete && migrationSuccess ? "outline" : "default"
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : migrationComplete && migrationSuccess ? (
                "Run Migration Again"
              ) : (
                "Migrate from KV to PostgreSQL"
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
