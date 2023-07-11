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
  webpack: (config, { isServer }) => {
    if (isServer) {
      import("./scripts/cache_article_slugs.mjs")
      import("./scripts/build_algolia_search.mjs")
    }
    return config
  },
}

module.exports = nextConfig
