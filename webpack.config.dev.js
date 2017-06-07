// 开发环境webpack配置
// 目的： 1 分离出 css文件  2 分离出公共js库文件  3 分离出业务逻辑js文件 4 反向代理到线上真实接口
const webpack = require("webpack");
const path = require('path');
const autoprefixer = require('autoprefixer'); // post css 自动浏览器前缀
const pxtorem = require('postcss-pxtorem');  //post css 处理pxtorem
console.log(path.resolve(__dirname, 'icon'))
// svg目录
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  // path.resolve(__dirname, '/icon/'),  // 2. 自己私人的 svg 存放目录
];

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: `${__dirname}/app/index.html`,
  filename: 'index.html',
  inject: 'body',
});

const ExtractTextPlugin = require("extract-text-webpack-plugin");  //分离css

module.exports =  {

  devtool: 'inline-source-map',  //配置sourcemap，方便错误调

  entry: {  //entry 入口源文件
    app: './app/index.js',
    vendor:['react', 'react-dom', 'react-router', 'axios', 'redux', 'react-redux','react-move'] //分离库文件
  },

  output: {    // output 输出路径
    path: `${__dirname}/dist`,
    publicPath : '/',  //用于生成的 路径为 为 /index_bundle.js
    filename: 'index_bundle.js',
  },

  resolve:{
    // 配置格式
    extensions: [ '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json', '.less'],
  },

  module: {

    rules: [
          // 1 js 和 es2015,排除node_modules
          {
            test: /\.js$/,
            exclude: /node_modules/, //排除 node_modules文件夹
            use: 'babel-loader'
          },
        // 2 css
        // {
        //   test: /\.css$/,
        //   use: ExtractTextPlugin.extract({
        //     fallback: "style-loader",
        //     use: "css-loader",
        //     publicPath: "/dist"
        //   })
        // },

        // 3 图片,加hash值
        {
          test: /\.(jpg|png|gif)$/,
          loader:'url-loader?limit=5000&name=images/[hash:8].[name].[ext]'
        },

        //4 处理font字体文件，加hash值
        {
          test: /\.(ttf|woff|eot)$/,
          loader: "file-loader?name=/fonts/[hash:8].[name].[ext]"
        },

        // 5 antd-mobile的icon图标配置
        {
          test: /\.(svg)$/i,
          loader: 'svg-sprite-loader',
          include: svgDirs // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
        },

        // 处理css和 less，其中less为antd-mobile的样式
        // antd-mobile需要px 转 rem，需要配置post-css
        {
         test: /\.(css|less)$/,
         use: [
           'style-loader','css-loader',
           {
             loader: 'postcss-loader',
             options: {
               ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
               plugins: () => [
                 autoprefixer({
                   browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                 }),
                 pxtorem({ rootValue: 100, propWhiteList: [] })
               ],
             },
           },
           {
             loader: 'less-loader',
             options: {
               modifyVars: { "@primary-color": "#1DA57A" },
             },
           },
         ],
       }


    ],
  },

  // devServer 则是 webpack-dev-server 设定
  devServer: {
    // hot:true,
    host:'0.0.0.0',  //  使用本地ip访问
    inline: true,
    quiet: true,
    port: 8080,
    proxy: {  //反向代理，将ajax请求数据，转发，完整接口url为http://api.chinaplat.com/getval_2017
       '/api': {
       target: 'https://api.douban.com/v2',
       changeOrigin: true,
       secure: false,
       pathRewrite: {"^/api" : ""} //去掉/api,取剩下的部分
       }
    }
  },

  // plugins 放置所使用的插件
  plugins: [
      HTMLWebpackPluginConfig,

      //1 chunk插件，分离公共库文件
      new webpack.optimize.CommonsChunkPlugin({name:"vendor", filename:"vendor.bundle.js"}),

      //2 处理react waring问题
      //而且可以在代码中直接使用，通过判断是否是production，可以不打包某些代码
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("development")
        }
      }),

      // 3 分离css文件
      new ExtractTextPlugin({
        filename: "[name].bundle.css",
        disable: false,
        allChunks: true
      })

  ],
};
