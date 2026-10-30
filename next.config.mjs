/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image يعرض صور المواقع الخارجية المسموح بها هنا فقط
    remotePatterns: [{ protocol: "https", hostname: "cdn.dummyjson.com" }],
  },
};

export default nextConfig;
