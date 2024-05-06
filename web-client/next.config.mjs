/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        domains: ['videosite.ddns.net'], 
    },
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    ) => {
        config.module.rules.push({ test: /\.graphql?$/, loader: 'webpack-graphql-loader' });
        return config
    },
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
