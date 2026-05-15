const backendOrigin = process.env.BACKEND_ORIGIN?.replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!backendOrigin) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/:path*`
      }
    ];
  }
};

export default nextConfig;
