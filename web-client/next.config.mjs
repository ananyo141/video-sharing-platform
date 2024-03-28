/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        config.module.rules.push({ test: /\.graphql?$/, loader: 'webpack-graphql-loader' });
        return config
    },
};

export default nextConfig;
