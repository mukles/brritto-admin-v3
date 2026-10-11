import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import { transform } from 'lightningcss'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stylesDir = resolve(root, 'src/styles')
const outFile = resolve(root, process.argv[2] ?? 'design/brritto-admin-animation.svg')

const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
})

try {
  const { AdminIllustration } = await server.ssrLoadModule(
    '/src/modules/auth/components/admin-illustration.tsx',
  )
  const markup = renderToStaticMarkup(createElement(AdminIllustration))

  const candidates = new Set()
  for (const [, classes] of markup.matchAll(/class="([^"]*)"/g)) {
    for (const name of classes.split(/\s+/)) if (name) candidates.add(name)
  }

  const globals = await readFile(resolve(stylesDir, 'globals.css'), 'utf8')
  const entry = globals
    .split('\n')
    .filter((line) => !/^@import\s/.test(line.trim()))
    .join('\n')
  const input = [
    '@layer theme, utilities;',
    "@import 'tailwindcss/theme.css' layer(theme);",
    "@import 'tailwindcss/utilities.css' layer(utilities);",
    "@import './variables.css';",
    "@import './animation.css';",
    entry,
  ].join('\n')

  const compiler = await compile(input, { base: stylesDir, onDependency: () => {} })
  const { code } = transform({
    filename: 'illustration.css',
    code: Buffer.from(compiler.build([...candidates])),
    minify: true,
  })

  const svg = markup.replace(
    /^<svg([^>]*)>/,
    (_, attributes) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="520"${attributes.replace(
        ' aria-hidden="true"',
        ' role="img" aria-label="Brritto reviewing, tagging and publishing questions"',
      )}><style>svg{font-family:'Geist Variable',system-ui,sans-serif}${code}</style>`,
  )

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, `${svg}\n`)
  console.log(`Exported ${outFile} (${(svg.length / 1024).toFixed(1)} kB)`)
} finally {
  await server.close()
}
