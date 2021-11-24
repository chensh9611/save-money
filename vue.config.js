const path = require('path')
//less文件的路径

module.exports = {
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "src/less/vantChange.less";`
          }
        }
      },
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/save-money-website/'
    : '/',
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    public: '192.168.1.8:8080',
  },
  chainWebpack: config => {
    const dir = path.resolve(__dirname, 'src/assets/icons')

    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(dir).end() // 包含 icons 目录
      .use('svg-sprite-loader').loader('svg-sprite-loader').options({extract: false}).end()
      .use('svgo-loader').loader('svgo-loader')
      .tap(options => ({...options, plugins: [{removeAttrs: {attrs: 'fill'}}]}))
    config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{plainSprite: true}])
    config.module.rule('svg').exclude.add(dir) // 其他 svg loader 排除 icons 目录

  }
}
