import { CloudflareKV } from "./cloudflare/kv";
import { prisma } from "./prisma";
import { Invite, InviteResponse } from "@/utils/interfaces/InviteType";

interface KVKey {
  name: string;
  expiration?: number;
  metadata?: unknown;
}

export async function migrateInvitesFromKV(): Promise<{
  success: boolean;
  message: string;
  stats: {
    invites: number;
    responses: number;
    errors: number;
    skipped: number;
  };
}> {
  try {
    // Get all invite keys from KV
    const inviteKeys = await CloudflareKV.list<KVKey>({ prefix: "invite:" });

    if (!inviteKeys?.length) {
      return {
        success: true,
        message: "No invites found in KV to migrate",
        stats: { invites: 0, responses: 0, errors: 0, skipped: 0 },
      };
    }

    console.log(`Found ${inviteKeys.length} invites to migrate`);

    // Get all response keys from KV
    const responseKeys = await CloudflareKV.list<KVKey>({
      prefix: "response:",
    });

    console.log(`Found ${responseKeys?.length || 0} responses to migrate`);

    // Track migration stats
    const stats = {
      invites: 0,
      responses: 0,
      errors: 0,
      skipped: 0,
    };

    // Map to store KV ID to Prisma ID mappings for template invites
    const templateIdMap = new Map<string, string>();

    // First pass: Migrate all invites
    for (const key of inviteKeys) {
      try {
        const kvInvite = await CloudflareKV.get<Invite>(key.name);

        if (!kvInvite) {
          console.warn(`Invite ${key.name} not found in KV`);
          stats.skipped++;
          continue;
        }

        // Check if invite already exists in Prisma
        const existingInvite = await prisma.invite.findUnique({
          where: { id: kvInvite.id },
        });

        if (existingInvite) {
          console.log(`Invite ${kvInvite.id} already exists, skipping`);
          stats.skipped++;

          // Still add to templateIdMap if it's a template
          if (kvInvite.is_template) {
            templateIdMap.set(kvInvite.id, existingInvite.id);
          }
          continue;
        }

        // Create the invite in Prisma
        const prismaInvite = await prisma.invite.create({
          data: {
            id: kvInvite.id, // Keep the same ID for consistency
            name: kvInvite.name || null,
            email: kvInvite.email || null,
            phone: kvInvite.phone || null,
            additional_guests:
              typeof kvInvite.additional_guests === "string"
                ? parseInt(kvInvite.additional_guests, 10) || 0
                : kvInvite.additional_guests || 0,
            events: kvInvite.events || {}, // Ensure events is never null
            created_at: new Date(kvInvite.created_at),
            updated_at: new Date(),
            is_template: kvInvite.is_template || false,
            template_name: kvInvite.template_name || null,
            location: kvInvite.location || null,
            // We'll handle template_invite_id in the second pass
          },
        });

        // If this is a template invite, store its ID mapping
        if (kvInvite.is_template) {
          templateIdMap.set(kvInvite.id, prismaInvite.id);
        }

        stats.invites++;
      } catch (error) {
        // Safely log the error, handling null values
        console.error(
          `Error migrating invite ${key.name}:`,
          error ? error.toString() : "Unknown error"
        );
        stats.errors++;
      }
    }

    // Second pass: Update template_invite_id references
    for (const key of inviteKeys) {
      try {
        const kvInvite = await CloudflareKV.get<Invite>(key.name);

        if (!kvInvite || !kvInvite.template_invite_id) {
          continue;
        }

        const templatePrismaId = templateIdMap.get(kvInvite.template_invite_id);

        if (!templatePrismaId) {
          console.warn(
            `Template invite ${kvInvite.template_invite_id} not found for invite ${kvInvite.id}`
          );
          continue;
        }

        // Update the invite with the template reference
        await prisma.invite.update({
          where: { id: kvInvite.id },
          data: {
            template_invite_id: templatePrismaId,
          },
        });
      } catch (error) {
        // Safely log the error, handling null values
        console.error(
          `Error updating template reference for invite ${key.name}:`,
          error ? error.toString() : "Unknown error"
        );
        stats.errors++;
      }
    }

    // Migrate responses
    if (responseKeys?.length) {
      for (const key of responseKeys) {
        try {
          const kvResponse = await CloudflareKV.get<InviteResponse>(key.name);

          if (!kvResponse) {
            console.warn(`Response ${key.name} not found in KV`);
            stats.skipped++;
            continue;
          }

          // Check if response already exists in Prisma
          const existingResponse = await prisma.response.findUnique({
            where: { id: kvResponse.id },
          });

          if (existingResponse) {
            console.log(`Response ${kvResponse.id} already exists, skipping`);
            stats.skipped++;
            continue;
          }

          // Check if the invite exists in Prisma
          const inviteExists = await prisma.invite.findUnique({
            where: { id: kvResponse.inviteId },
          });

          if (!inviteExists) {
            console.warn(
              `Invite ${kvResponse.inviteId} not found for response ${kvResponse.id}`
            );
            stats.skipped++;
            continue;
          }

          // Create the response in Prisma
          await prisma.response.create({
            data: {
              id: kvResponse.id, // Keep the same ID for consistency
              name: kvResponse.name || "",
              email: kvResponse.email || "",
              phone: kvResponse.phone || "",
              additional_guests:
                typeof kvResponse.additional_guests === "string"
                  ? parseInt(kvResponse.additional_guests, 10) || 0
                  : kvResponse.additional_guests || 0,
              events: kvResponse.events || {}, // Ensure events is never null
              created_at: new Date(kvResponse.created_at || new Date()),
              updated_at: new Date(
                kvResponse.updated_at || kvResponse.created_at || new Date()
              ),
              invite_id: kvResponse.inviteId,
            },
          });

          stats.responses++;
        } catch (error) {
          // Safely log the error, handling null values
          console.error(
            `Error migrating response ${key.name}:`,
            error ? error.toString() : "Unknown error"
          );
          stats.errors++;
        }
      }
    }

    return {
      success: true,
      message: `Migration completed: ${stats.invites} invites and ${stats.responses} responses migrated, ${stats.skipped} items skipped, ${stats.errors} errors`,
      stats,
    };
  } catch (error) {
    // Safely log the error, handling null values
    console.error(
      "Migration failed:",
      error ? error.toString() : "Unknown error"
    );
    return {
      success: false,
      message: `Migration failed: ${
        error instanceof Error
          ? error.message
          : error
          ? error.toString()
          : "Unknown error"
      }`,
      stats: { invites: 0, responses: 0, errors: 1, skipped: 0 },
    };
  }
}
