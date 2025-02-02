import { CloudflareKV } from "@/lib/cloudflare/kv";

let kvInstance: CloudflareKV | null = null;

export async function getKV(): Promise<CloudflareKV> {
  if (!kvInstance) {
    kvInstance = new CloudflareKV();
  }
  return kvInstance;
}
