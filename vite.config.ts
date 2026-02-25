import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
base:"./",
  server:{
    open: false,//启动项目自动弹出浏览器
    port: 4002,//启动端口
    proxy: {
      '/api': {
        target: 'http://localhost:8081',	//实际请求地址
        changeOrigin: true,
        rewrite: (path) => path
      },
    }
  },

  plugins: [vue(),  AutoImport({
    imports: [
      'vue',
      {
        'naive-ui': [
          'useDialog',
          'NLayout',
          'useMessage',
          'useNotification',
          'useLoadingBar'
        ]
      }
    ]
  }),
  Components({
    resolvers: [NaiveUiResolver()]
  })],
})
