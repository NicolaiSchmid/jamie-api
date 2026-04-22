import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import * as MdxConfig from './source.config'

const config = defineConfig({
  resolve: {
    alias: {
      tslib: 'tslib/tslib.es6.mjs',
    },
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ['tslib'],
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    mdx(MdxConfig),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
