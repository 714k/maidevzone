// const esbuild = require('esbuild');
// const production = process.argv.includes('--production');
// const watch = process.argv.includes('--watch');

// async function main() {
//   const ctx = await esbuild.context({
//     entryPoints: ['src/extension.ts'],
//     bundle: true,
//     format: 'cjs',
//     minify: production,
//     sourcemap: !production,
//     sourcesContent: false,
//     platform: 'node',
//     outfile: 'dist/extension.js',
//     external: ['vscode'],
//     logLevel: 'silent',
//     plugins: [
//       {
//         name: 'watch-plugin',
//         setup(build) {
//           build.onEnd(result => {
//             console.log(result.errors.length ? '❌ Build failed' : '✅ Build succeeded');
//           });
//         }
//       }
//     ]
//   });

//   if (watch) {
//     await ctx.watch();
//     console.log('👀 Watching for changes...');
//   } else {
//     await ctx.rebuild();
//     await ctx.dispose();
//   }
// }

// main().catch(e => {
//   console.error(e);
//   process.exit(1);
// });
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
