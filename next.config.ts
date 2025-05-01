const isDev = process.env.NODE_ENV === "development"

const nextConfig = {
  // dein bestehender Export …
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
            value: isDev
              ? "script-src 'self' 'unsafe-eval'; object-src 'none'; base-uri 'none';"
              : "script-src 'self'; object-src 'none'; base-uri 'none';"
          }
        ]
      }
    ]
  }
}

export default nextConfig
