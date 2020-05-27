// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        prodEnv: require('./prod.env'),
        testEnv: require('./test.env'),
        trainEnv: require('./train.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',          //请根据自己路径配置更改
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 16700,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            /*
             * use gateway
             */
            '/api': {
                target: 'http://127.0.0.1:16800',
                pathRewrite: {
                    '^/api': '/customs'
                },
            },
            // '/api/system': {
            //     target: 'http://localhost:18105',
            //     pathRewrite: {
            //         '^/api/system': '/system'
            //     },
            // },
            // '/api/core/pay': {
            //     target: 'http://localhost:18105',
            //     pathRewrite: {
            //         '^/api/core/pay': '/core/pay'
            //     },
            // },
            // '/api/loan/audit': {
            //     target: 'http://localhost:18304',
            //     pathRewrite: {
            //         '^/api/loan/audit': '/loan/audit'
            //     },
            // },
            // '/api/goods': {
            //     target: 'http://localhost:18403',
            //     pathRewrite: {
            //         '^/api/goods': '/goods'
            //     },
            // },
            // '/api/mall': {
            //     target: 'http://localhost:18403',
            //     pathRewrite: {
            //         '^/api/mall': '/mall'
            //     },
            // },
            // '/api/active': {
            //     target: 'http://localhost:18401',
            //     pathRewrite: {
            //         '^/api/active': '/mall/active/manager'
            //     },
            // },
            // '/api/order': {
            //     target: 'http://localhost:18404',
            //     pathRewrite: {
            //         '^/api/order': '/mall/order/manager'
            //     },
            // },
            // '/api/channel': {
            //     target: 'http://localhost:18305',
            //     pathRewrite: {
            //         '^/api/channel': '/channel'
            //     },
            // },
            // '/api/telesale': {
            //     target: 'http://localhost:18311',
            //     pathRewrite: {
            //         '^/api/telesale': '/telesale'
            //     },
            // },
            // '/api/after': {
            //     target: 'http://localhost:18303',
            //     pathRewrite: {
            //         '^/api/after': '/after'
            //     },
            // },
            // '/api/settle': {
            //     target: 'http://localhost:18310',
            //     pathRewrite: {
            //         '^/api/settle': '/settle'
            //     },
            // },
            // '/api/data': {
            //     target: 'http://localhost:18307',
            //     pathRewrite: {
            //         '^/api/data': '/data'
            //     },
            // },
            // '/api/loan/debt': {
            //     target: 'http://localhost:18308',
            //     pathRewrite: {
            //         '^/api/loan/debt': '/loan/debt'
            //     },
            // },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}

