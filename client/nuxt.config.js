import env from './env';
export default {
  loading: '~/components/Loading.vue',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '四糸乃赛高的个人博客',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: '这里是四糸乃赛高的个人博客,分享一些学习编程中遇到的一些问题及动漫相关内容' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'keywords', content: '博客,四糸乃赛高,前端,个人博客,动漫' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    // script: [
    //   { src: env.BASE_URL + "/static/live2dw/L2Dwidget.min.js" }
    // ]
  },
  server: {
    port: 8080,
    host: '0.0.0.0'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~/assets/styles/main.scss', lang: 'scss' },
    '~/static/iconfont/iconfont.css',
    '~/static/wysiwyg.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/filters',
    '~/plugins/axios',
    '~/plugins/api',
    '~/plugins/mixin',
    {
      src: '~/plugins/plugin', ssr: false
    },
    {
      src: '~/static/iconfont/iconfont.js', ssr: false
    }
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

  ],
  bootstrapVue: {
    icons: true // Install the IconsPlugin (in addition to BootStrapVue plugin
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    proxy: true,
    credentials: true,
  },

  proxy: {
    '/api': env.BASE_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env
}
