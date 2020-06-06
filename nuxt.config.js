const URL = 'https://nuxt-socket-io.netlify.app'

export default {
  target: 'static',
  ssr: true, // similar to mode: 'universal'
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (chunk) => {
      if (chunk) {
        return `${chunk} - Nuxt Socket.IO`
      }

      return 'Nuxt Socket.IO'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Open Graph
      { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt Socket.io' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: URL },
      { hid: 'og:image', property: 'og:image', content: `${URL}/card.png` }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#48bb78' },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/categories',
    '@/plugins/i18n.client',
    '@/plugins/vue-scrollactive',
    '@/plugins/components',
    '@/plugins/menu.client'
  ],
  /*
  ** Give routes to static generation
  */
  generate: {
    fallback: '404.html', // for Netlify
    routes: ['/'] // give the first url to start crawling
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/color-mode-module
    '@nuxtjs/color-mode'
    // https://github.com/bdrtsky/nuxt-ackee
    // 'nuxt-ackee'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-i18n',
    '@nuxtjs/pwa',
    '@nuxt/content',
    'nuxt-socket-io'
  ],
  io: {
    sockets: [{
      url: 'https://nuxt-socket-io.herokuapp.com'
    }]
  },
  /*
  ** Components auto import
  ** See https://github.com/nuxt/components
  */
  components: {
    dirs: [
      { path: '@/components', pattern: '*.vue' }
    ]
  },
  /*
  ** Modules configuration
  */
  colorMode: {
    preference: 'light'
  },
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      }
    }
  },
  i18n: {
    //   locales: [{
    //     code: 'fr',
    //     iso: 'fr-FR',
    //     file: 'fr-FR.js',
    //     name: 'Français'
    //   }, {
    //     code: 'en',
    //     iso: 'en-US',
    //     file: 'en-US.js',
    //     name: 'English'
    //   }],
    locales: [{
      code: 'en',
      iso: 'en-US',
      file: 'en-US.js',
      name: 'English'
    }],
    defaultLocale: 'en',
    parsePages: false,
    lazy: true,
    seo: false,
    langDir: 'i18n/'
  },
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {},
    parallel: true,
    cache: true,
    hardSource: true
  }
  // ,
  // ackee: {
  //   server: 'https://ackee.nuxtjs.com',
  //   domainId: '7b3c9779-442c-40c6-9931-ea71977c52a8',
  //   detailed: true
  // }
}
