const path = require('path');

const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    // Set page title
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'ERP/CRM System';
        return args;
      });
  }
});