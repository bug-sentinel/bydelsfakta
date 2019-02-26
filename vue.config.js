module.exports = {
  lintOnSave: true,
  publicPath: '/bydelsfakta',
  outputDir: 'docs',
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  css: {
    sourceMap: true,
  },

  pluginOptions: {
    i18n: {
      locale: 'nb-no',
      fallbackLocale: 'nb-no',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
