import type { NextConfig } from "next";

const supabaseImagePattern = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/**`)
  : null;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      ...(supabaseImagePattern ? [supabaseImagePattern] : []),
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
