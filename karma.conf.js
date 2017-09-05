// Karma configuration
// Generated on Tue Jul 18 2017 18:01:48 GMT+0800 (CST)

const path = require('path')
const webpack = require('webpack')
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
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['source-map-support', 'mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      './node_modules/es5-polyfill/dist/polyfill.js',
      'test/spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'].concat(
      coverage ? 'coverage-istanbul' : [],
      sauceLabs ? 'saucelabs' : []
    ),

    coverageIstanbulReporter: {
      dir: './coverage',
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html'
        },
        'text-summary': {
          subdir: 'text-summary'
        },
        lcovonly: {
          subdir: '.',
          file: 'lcov.info'
        }
      }
    },

    mochaReporter: {
      showDiff: true
    },

    browserLogOptions: { terminal: true },
    browserConsoleLogOptions: { terminal: true },

    browserNoActivityTimeout: 5 * 60 * 1000,
    browserDisconnectTimeout: 15 * 1000,
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
    concurrency: 2,

    webpack: {
      // devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.ts']
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
              preserveComments: coverage,
              produceSourceMap: coverage,
              transpileOnly: true,
              compilerOptions: {
                target: 'es5',
                module: 'commonjs'
              }
            }
          },
          coverage ? {
            enforce: 'post',
            test: /\.ts$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            include: path.resolve('src/'),
            exclude: /node_modules/
          } : {}
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          coverage: coverage,
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
          DISABLE_FLAKEY: !!String(process.env.FLAKEY).match(/^(0|false)$/gi)
        })
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
