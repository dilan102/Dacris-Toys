export type SupabaseBrowserConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "",
  };
}
