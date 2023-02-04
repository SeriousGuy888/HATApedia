/** @type {import('next').NextConfig} */
module.exports = {
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
