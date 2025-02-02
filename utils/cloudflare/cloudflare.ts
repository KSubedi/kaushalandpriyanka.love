import Cloudflare from "cloudflare";

export const cfClient = new Cloudflare({
  apiEmail: process.env["CLOUDFLARE_EMAIL"], // This is the default and can be omitted
  apiKey: process.env["CLOUDFLARE_API_KEY"], // This is the default and can be omitted
});

export const getNamespace = async () => {
  return await cfClient.kv.namespaces.get(
    process.env.CLOUDFLARE_NAMESPACE_ID!,
    {
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    }
  );
};
