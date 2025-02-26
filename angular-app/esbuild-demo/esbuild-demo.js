const esbuild = require('esbuild')

esbuild.build({
  entryPoints: {
    main: "./src/main.ts"
  },
  outdir: "./dist",
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  entryNames: '[name]-[hash]',
  write: false
}).then(buildResult => {
  console.log(buildResult);
  console.log(buildResult.outputFiles[0].text)
})