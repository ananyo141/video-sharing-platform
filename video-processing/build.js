const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['index.ts'],
    platform: 'node',
    bundle: true,
    minify: true,
    outfile: './build/index.js',
    sourcemap: false,
    tsconfig: './tsconfig.json',
    define: {
      'process.env.FLUENTFFMPEG_COV': '0',
    }
  })
  .then(() => console.log('⚡Bundle build complete ⚡'))
  .catch(() => {
    process.exit(1);
  });
