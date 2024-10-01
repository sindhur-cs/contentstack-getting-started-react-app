/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev11-images.csnonprod.com",
        pathname: "/v3/assets/**",
      },
      {
        protocol: "https",
        hostname: "images.contentstack.io",
        pathname: "/v3/assets/**",
      },
    ],
  },
  env: {
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION,
    CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    CONTENTSTACK_HOST_ENV: process.env.CONTENTSTACK_HOST_ENV,
    NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID:
      process.env.NEXT_PUBLIC_PERSONALIZATION_PROJECT_UID,
    NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL:
      process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL,
  },
};

export default nextConfig;
