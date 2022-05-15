const {resolve} = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
    mode: 'development',
    devtool: 'source-map',
    entry: './app/index.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: true,
        alias: {
            "react": resolve('./node_modules/react')
        }
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, env && env.output || 'build')
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: [/node_modules/],
            loader: "ts-loader"
        }, {
            test: /\.(js)$/,
            exclude: [/node_modules/],
            loader: "babel-loader"
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: {
                            localIdentName: "[name]__[local]"
                        },
                    },
                }
            ]
        }, {
            test: /\.(png|jpe?g|gif|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'img',
                        outputPath: 'img',
                        useRelativePath: true
                    },
                },
            ],
        }, {
            test: /\.stl$/,
            loader: 'url-loader'
        }, {
            test: /\.wasm$/,
            loader: "wasm-loader"
        }, {
            test: /\.glsl$/,
            loader: "raw-loader"
        }, {
            test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
            type: 'asset/resource'
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/app/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
    ],
    devServer: {
        port: 8081,
        historyApiFallback: true,
    }
});
