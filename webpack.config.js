const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function createBabelLoader() {
  return {
    loader: 'babel-loader',
    options: {
      configFile: false,
      babelrc: false,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        //'module:metro-react-native-babel-preset',
      ],
      //plugins: ['react-hot-loader/babel'],
    },
  };
}

function localIdentName(isProduction) {
  if (isProduction) {
    return 'm-[hash:base64:5]';
  }
  return 'm___[path]___[name]__[local]___[hash:base64:5]';
}

function createDtsCssModulesLoader() {
  return {
    loader: 'dts-css-modules-loader',
    options: {
      namedExport: true,
      camelCase: true,
      modules: true,
      localIdentName,
    },
  };
}

function createCssModulesLoader(isProduction = true, regex = /\.css$/) {
  return {
    loader: 'css-loader',
    options: {
      modules: {
        auto: regex,
        exportLocalsConvention: 'camelCaseOnly',
        localIdentName: localIdentName(isProduction),
      },
    },
  };
}

function createPostCssLoader() {
  return {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        config: path.resolve(__dirname, 'postcss.config.web.js'),
      },
    },
  };
}

module.exports = function (env, argv) {
  const isProduction = argv.mode === 'production';
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      //'./polyfills',
      //'react-hot-loader/patch',
      main: './index.web.js',
      // output any theme CSS seperately so consuming apps can choose what theme to load
      themeCube: './themes/cube.theme.css',
      themeBorg: './themes/borg.theme.css',
    },
    output: {
      path: path.resolve(__dirname, 'dist/web'),
    },
    devServer: {
      hot: true,
      port: 8082,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.ejs'),
        // dont want to add all themes automatically (also don't need the JS counterpart), template will just include the desired one
        excludeChunks: ['themeBorg', 'themeCube'],
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            createBabelLoader(),
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  target: 'es5',
                },
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: createBabelLoader(),
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
            },
          },
        },
        // specifying theme css seperately as dont want postcss to resolve CSS variables
        // we want these to be available at build time of consumer app, and want to make it possible to also use these at runtime (for theme switching)
        {
          test: /\.theme\.css$/,
          use: [
            // want to extract the bundled css to distribute as a seperate resource
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /(?<!\.theme)\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            createDtsCssModulesLoader(),
            createCssModulesLoader(isProduction),
            createPostCssLoader(),
          ],
        },
        {
          test: /\.scss$/,
          use: [
            // want to extract the bundled css to distribute as a seperate resource
            MiniCssExtractPlugin.loader,
            createDtsCssModulesLoader(),
            createCssModulesLoader(isProduction, /\.scss$/),
            createPostCssLoader(),
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: [
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
        '.web.js',
        '.js',
        '.web.jsx',
        '.jsx',
        '.web.css',
        '.css',
      ],
      mainFields: ['browser', 'main'],
    },
    optimization: {
      moduleIds: 'named',
      minimize: false,
    },
  };
};
