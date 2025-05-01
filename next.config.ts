const isVercelPreview = process.env.VERCEL_ENV === "preview"

const nextConfig = {
  experimental: {
    serverActions: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isVercelPreview
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none';"
              : "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none';"
          }
        ]
      }
    ]
  },
}

export default nextConfig
