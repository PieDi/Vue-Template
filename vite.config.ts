import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  console.log('当前环境', command)
  return {
    plugins: [
      vue(),
      viteCompression(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    // 打包配置
    build: {
      sourcemap: command === 'build' ? false : true,
      outDir: 'dist', //指定输出目录
      assetsDir: 'assets', //指定静态资源存储目录(相对于outDir)
      // 将js、css文件分离到单独文件夹
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
      minify: true,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      // 预处理器配置项
      preprocessorOptions: {
        less: {
          math: 'always',
        },
      },
    },
  }
})
