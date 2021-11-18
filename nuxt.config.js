 import theme from '@nuxt/content-theme-docs'

const URL = 'https://nuxt-socket-io.netlify.app'

export default theme({
  telemetry: false,
  // server: {
  //   port: 3001
  // },
  target: 'static',
  ssr: true,
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
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#48bb78' },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-socket-io'
  ],
  io: {
    sockets: [{
      url: 'https://nuxt-socket-io.herokuapp.com'
    }]
  },
  i18n: {
    locales: () => [{
      code: 'en',
      iso: 'en-US',
      file: 'en-US.js',
      name: 'English'
    }],
    defaultLocale: 'en'
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
})
