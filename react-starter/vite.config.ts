/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

/**
 * APIモックのService Workerを有効化/無効化するvite pluginのファクトリ。
 *
 * Mock Service Worker(MSW)はBrowserではService Workerで起動する。
 * main.tsxやApp.tsxの中でenvの値を見てモックを有効化/無効化することもできるが、
 * viteでbuild時にTree shakingがうまく働かず不要なリソースがバンドルされてしまう。
 *
 * それを防ぐために、index.htmlレベルでAPIモックのモジュールを読み込む/読み込まないを制御することで
 * Tree shakingを機能させ、buildしたモジュールにモックのソースがバンドルされないようにする。
 *
 * @param config pluginの設定
 * @returns vite plugin
 */
const apimock = (config?: { enable: boolean }) => {
  return {
    name: 'transform-html-to-mock-api',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string => {
        const enable = config?.enable
        console.log(`${enable ? 'Enabling' : 'Disabling'} API mock service worker...`)
        return html.replace(
          /<!--(\s*)%INJECT_API_MOCK_SERVICE_WORKER_SCRIPT%(\s*)-->/,
          enable ? `<script type="module" src="/__mocks__/api/browser.ts" defer></script>` : ''
        )
      },
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: process.env.BASE_PATH || '/', //basepathをbuild時の環境変数で指定できるように
    root: 'src',
    publicDir: '../public', //rootからの相対パス
    envDir: '../', //rootからの相対パス
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'), //絶対パスでのインポートの設定(viteはtsconfigのpathをみないため)
      },
    },
    build: {
      outDir: process.env.BUILD_OUT_DIR_PATH || '../dist', //rootからの相対パス
      emptyOutDir: true,
      sourcemap: 'hidden',
    },
    server: {
      open: process.env.BASE_PATH || '/', //baseとあわせる
    },
    //vitest config
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './testing/setup.ts',
      cache: {
        dir: '../node_modules/.vitest',
      },
      coverage: {
        all: true,
        reportsDirectory: '../coverage',
        include: [
          'src/**',
          '!src/**/*.d.ts',
          '!src/**/*.{test,stories}.{js,cjs,mjs,ts,jsx,tsx}',
          '!src/**/{__tests__,__mocks__}/**',
          '!src/testing/**',
        ],
      },
    },
    plugins: [
      react(),
      apimock({
        enable: process.env.ENABLE_API_MOCK === 'true' || mode === 'development',
      }),
    ],
  }
})
