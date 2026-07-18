import { build } from 'esbuild'
import { rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outdir = join(root, 'build-electron')

rmSync(outdir, { recursive: true, force: true })

const shared = {
  platform: 'node',
  target: 'es2022',
  bundle: true,
  external: ['electron'],
  sourcemap: true,
}

async function main() {
  await Promise.all([
    build({
      ...shared,
      entryPoints: [join(root, 'electron', 'main.ts')],
      outfile: join(outdir, 'main.cjs'),
      format: 'cjs',
    }),
    build({
      ...shared,
      entryPoints: [join(root, 'electron', 'preload.ts')],
      outfile: join(outdir, 'preload.cjs'),
      format: 'cjs',
    }),
  ])
  console.log('Electron build complete -> build-electron/')
}

main().catch((err) => {
  console.error('Electron build failed:', err)
  process.exit(1)
})
