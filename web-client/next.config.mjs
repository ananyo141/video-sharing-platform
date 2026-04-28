/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-local",
  images: {
    domains: ["videosite.ddns.net", "localhost", "127.0.0.1"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.module.rules.push({ test: /\.graphql?$/, loader: "webpack-graphql-loader" });
    return config;
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
