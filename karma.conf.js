const webpack = require('webpack')
const path = require('path')
const ES3 = require('es3ify-webpack-plugin')
const resolve = pkg => path.join(__dirname, './packages', pkg, 'src')
const coverage = String(process.env.COVERAGE) !== 'false'
const ci = String(process.env.CI).match(/^(1|true)$/gi)
const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const sauceLabs = realBrowser && ci
const sauceLabsLaunchers = {
  sl_win_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10'
  },
  sl_mac_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'macOS 10.12'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10'
  },
  sl_mac_firfox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'macOS 10.12'
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11.103',
    platform: 'Windows 10'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '10.0',
    platform: 'Windows 7'
  },
  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '9.0',
    platform: 'Windows 7'
  },
  sl_ios_safari_9: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '10.3'
  },
  sl_ios_safari_12: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '12.2'
  },
  SL_ANDROID5: {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '5.1'
  },
  SL_ANDROID8: {
    base: 'SauceLabs',
    browserName: 'Chrome',
    platform: 'Android',
    version: '8.0',
    device: 'Android Emulator'
  }
}

const travisLaunchers = {
  chrome_travis: {
    base: 'Chrome',
    flags: ['--no-sandbox']
  }
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : ['Chrome']

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],

    // list of files / patterns to load in the browser
    files: [
      'browsers/karma.js',
      './node_modules/es6-promise/dist/es6-promise.auto.min.js',
      './node_modules/es5-polyfill/dist/polyfill.js',
      './node_modules/es6-object-assign/dist/object-assign-auto.min.js',
      'browsers/ie8.js',
      'browsers/polyfill.js',
      'packages/*/__tests__/**/*spec.js?(x)'
    ],

    specReporter: {
      failFast: false,
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: true, // do not print information about passed tests
      suppressSkipped: true // do not print information about skipped tests
    },

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'packages/*/__tests__/**/*spec.js?(x)': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'jasmine-diff'].concat(
      coverage ? [] : [],
      sauceLabs ? 'saucelabs' : []
    ),

    browserLogOptions: { terminal: true },
    browserConsoleLogOptions: { terminal: true },

    browserNoActivityTimeout: 15 * 60 * 1000,
    browserDisconnectTimeout: 30 * 1000,
    browserDisconnectTolerance: 2,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: sauceLabs ? Object.keys(sauceLabsLaunchers) : localBrowsers,

    customLaunchers: sauceLabs ? sauceLabsLaunchers : travisLaunchers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    webpack: {
      // devtool: 'inline-source-map',
      resolve: {
        alias: {
          nervjs: resolve('nerv'),
          'nerv-devtools': resolve('nerv-devtools'),
          'nerv-shared': resolve('nerv-shared'),
          'nerv-utils': resolve('nerv-utils'),
          'nerv-server': resolve('nerv-server'),
          'nerv-redux': resolve('nerv-redux')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        mainFields: ['main', 'module']
      },
      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                target: 'es3',
                module: 'commonjs'
              }
            }
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          coverage: coverage,
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
          DISABLE_FLAKEY: !!String(process.env.FLAKEY).match(/^(0|false)$/gi)
        }),
        new ES3()
      ]
    },
    stats: 'errors-only',
    webpackMiddleware: {
      noInfo: true,
      stats: {
        errorDetails: true
      }
    }
  })
}
