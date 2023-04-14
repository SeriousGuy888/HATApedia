const { withPlaiceholder } = require("@plaiceholder/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/article/:slug*",
        destination: "/articles/:slug*",
        permanent: true,
      },
    ]
  },
}

module.exports = withPlaiceholder(nextConfig)