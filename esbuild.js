const esbuild = require('esbuild');

const watch = process.argv.includes('--watch');

const buildConfig = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  external: ['vscode'],
  sourcemap: true,
};

if (watch) {
  buildConfig.watch = {
    onRebuild(error) {
      if (error) {
        console.error('Rebuild failed:', error);
      } else {
        console.log('Rebuild succeeded');
      }
    },
  };
}

esbuild.build(buildConfig).catch(() => process.exit(1));
