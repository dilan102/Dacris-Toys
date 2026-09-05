import type { NextConfig } from "next";

const supabaseImagePattern = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/**`)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImagePattern ? [supabaseImagePattern] : [],
  },
};

export default nextConfig;
