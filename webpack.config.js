const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
  mode: 'development',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'toolpic.esm.js',
    library: 'toolpic',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env", {
                  exclude: [

                  ]
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-transform-runtime", {
                "regenerator": true,
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      EventEmitter$: path.resolve(__dirname, 'src/EventEmitter/EventEmitter.js'),
      Events$: path.resolve(__dirname, 'src/EventEmitter/Events.js'),
      Helpers: path.resolve(__dirname, 'src/helpers'),
      VueComponents$: path.resolve(__dirname, 'src/vue-resources/vue-components/__index.js'),
      VueHelpers$: path.resolve(__dirname, 'src/vue-resources/vue-helpers/__index.js'),
      VueDirectives$: path.resolve(__dirname, 'src/vue-resources/vue-directives/__index.js')
    }
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new VueLoaderPlugin()
  ],
  externals: [
    'animejs',
    'mapbox-gl',
    /^vue(\/.+)?$/,
  ]
}

const configWeb = {
  mode: 'development',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'toolpic.js',
    library: 'Toolpic',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env", {
                  exclude: [

                  ]
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-transform-runtime", {
                "regenerator": true,
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      webpack$: path.resolve(__dirname, 'webpackNull.js'),
      EventEmitter$: path.resolve(__dirname, 'src/EventEmitter/EventEmitter.js'),
      Helpers: path.resolve(__dirname, 'src/helpers'),
      VueComponents$: path.resolve(__dirname, 'src/vue-resources/vue-components/__index.js'),
      VueHelpers$: path.resolve(__dirname, 'src/vue-resources/vue-helpers/__index.js'),
      VueDirectives$: path.resolve(__dirname, 'src/vue-resources/vue-directives/__index.js')
    }
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new VueLoaderPlugin()
  ]
}


module.exports = [config, configWeb];
