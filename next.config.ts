import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* This app reads from a live database on almost every route (auth, search,
     forms), so we use the standard dynamic-rendering model rather than
     Cache Components — simpler to reason about for a data-driven app. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
