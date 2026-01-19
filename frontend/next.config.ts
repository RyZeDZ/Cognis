import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // This is the hostname from your Supabase URL
        hostname: "hnlhupznwpgpftlejpdi.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cognis-images/**",
      },
      // --- ADD THIS NEW BLOCK FOR GOOGLE ---
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // Allow any path on this domain
      },
    ],
  },
};

export default nextConfig;
