const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成build文件夹及文件：
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    // devtool: 'eval-source-map',
    entry: {
        app: path.resolve(SRC_PATH, 'index.js'),
        verdor: Object.keys(pkg.dependencies)
    },
    output: {
        path: BUILD_PATH,
        filename: 'js/[name].[hash:5].js',

    },
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css", ".scss"],
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: path.resolve(SRC_PATH, 'node_modules'),
            include: SRC_PATH,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015']
                }
            }

        }, {
            test: /\.scss$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({ // css-hot-loader结局热替换CSS不自动刷新
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader'],
            }))
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192 // 小于8KB 使用base64格式图片
                }
            }]
        }, {
            test: /\.css$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            }))
        }, {
            test: /\.(mp3|webm|ogg)/,
            use: {
                loader: 'file-loader',
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        // webpack 内置的 banner-plugin
        new webpack.BannerPlugin("Copyright by https://github.com/chenjun1127"),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/[name].[hash:5].js'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new HtmlWebpackPlugin({
            title: 'react-music-player',
            template: './templates/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin('css/[name].[hash:5].css')
    ]
}
