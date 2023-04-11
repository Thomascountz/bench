const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  base: process.env.NODE_ENV === 'production'
  ? '/bench/'
  : '/'
})
