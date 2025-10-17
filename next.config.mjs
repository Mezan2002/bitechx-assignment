/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.bikedekho.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "laravelpoint.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
