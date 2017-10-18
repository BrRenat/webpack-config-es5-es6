/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      include: [
        path.join(process.cwd(), 'src'),
      ],
      exclude: path.resolve('./node_modules'),
      query: options.babelQuery,
    }, {
      test: /\.css$/,
      include: [
        path.join(process.cwd(), 'src', 'styles'),
        path.join(process.cwd(), 'node_modules'),
      ],
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            context: '/',
          },
        },
        'postcss-loader',
      ],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.svg$/,
      oneOf: [
        // svg, imported in 'styles.js' file
        // will be processed by file-loader
        {
          issuer: /styles\.js/,
          use: 'file-loader',
        },
        // overwise,
        // it will be processed by svg-sprite-loader
        {
          use: [{
            loader: 'svg-sprite-loader',
            options: {
              name: '[name]_[hash]',
              prefixize: true,
            },
          }]
        },
      ],
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
      },
    }, {
      test: /\.ejs$/,
      loader: 'ejs-loader'
    },],
  },
  plugins: options.plugins.concat([
    // ModuleConcatenationPlugin removes function-wrapper for each module
    // and decreases bundle size
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js',
    }),
    // @TODO: Add separate npm script to run bundle analyzer
    // new BundleAnalyzerPlugin(),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      __PRODUCTION__: JSON.stringify(process.env.NODE_ENV === 'production'),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_ENV: JSON.stringify(process.env.APP_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ]),
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
    alias: {
      components: path.resolve(process.cwd(), 'src/components/'),
      containers: path.resolve(process.cwd(), 'src/containers/'),
      'redux/': path.resolve(process.cwd(), 'src/redux/'),
      'constants': path.resolve(process.cwd(), 'src/constants.js'),
    },
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
