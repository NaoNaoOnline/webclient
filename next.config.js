/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "fastly.picsum.photos",
    ],
  },
};

module.exports = nextConfig;
