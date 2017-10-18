// Important modules this config uses
const fs = require('fs-extra')
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const build = require('webpack-build')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin')

const prodConfig = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }),
  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
}

const legacyConfig = require('./webpack.base.babel')(Object.assign({}, prodConfig, {
  // In production, we skip all hot-reloading stuff
  entry: {
    bundle: [
      path.join(process.cwd(), 'src/index.js'),
    ],
    'vendor-legacy': [
      'babel-polyfill',
      'react',
      'react-dom',
    ],
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    publicPath: './',
    filename: '[name].[chunkhash].legacy.js',
    chunkFilename: '[name].[chunkhash].chunk.legacy.js',
  },

  babelQuery: {
    presets: [
      ['env', {
        debug: true,
        modules: false,
        useBuiltIns: true,
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'Firefox ESR',
          ],
        },
      }],
      require.resolve('babel-preset-react-app'),
    ],
    plugins: [
      'syntax-dynamic-import'
    ],
  },

  plugins: prodConfig.plugins.concat([
    // new UglifyJSPlugin(),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true,
      // },
      inject: false,
    }),
  ])
}))

const modernConfig = require('./webpack.base.babel')(Object.assign({}, prodConfig, {
  // In production, we skip all hot-reloading stuff
  entry: {
    bundle: [
      path.join(process.cwd(), 'src/index.js'),
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    publicPath: './',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  babelQuery: {
    presets: [
      'react',
      ['env', {
        debug: true,
        modules: false,
        useBuiltIns: true,
        targets: {
          browsers: [
            // The last two versions of each browser, excluding versions
            // that don't support <script type="module">.
            'last 2 Chrome versions', 'not Chrome < 60',
            'last 2 Safari versions', 'not Safari < 10.1',
            'last 2 iOS versions', 'not iOS < 10.3',
            'last 2 Firefox versions', 'not Firefox < 54',
            'last 2 Edge versions', 'not Edge < 15',
          ],
        },
      }],
    ],
    plugins: [
      'syntax-dynamic-import',
      'transform-object-rest-spread',
      'transform-class-properties'
    ],
  },

  plugins: prodConfig.plugins.concat([
    // new UglifyJSPlugin(),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true,
      // },
      inject: false,
    }),

    new ManifestPlugin(),
  ])
}))

const createCompiler = (config) => {
  const compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({colors: true}) + '\n');
        resolve();
      });
    });
  };
};

const compileModernBundle = createCompiler(modernConfig);
const compileLegacyBundle = createCompiler(legacyConfig);

module.exports = async () => {
  console.log('............compileModernBundle')
  await compileModernBundle()

  console.log('............compileLegacyBundle')
  await compileLegacyBundle()
};
