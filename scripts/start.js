process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// eslint-disable-next-line
const express = require('express');
const webpack = require('webpack');
const path = require('path');

// eslint-disable-next-line
const proxy = require('http-proxy-middleware');
// eslint-disable-next-line
const webpackHotMiddleware = require('webpack-hot-middleware');
// eslint-disable-next-line
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../config/webpack.dev.config');

const app = express();

// TODO: 把这整整，或者把配置文件抽出来；
const mingyuan = 'http://10.188.40.14:9930';
app.use('/test', proxy({ target: 'http://gz-loc-development00.gz.sftcwl.com:7300/mock/5be14fcfa9b82994f6c1ec9c/sofa', changeOrigin: true }));
app.use('/user', proxy({ target: 'http://gz-loc-development00.gz.sftcwl.com:7300/mock/5be14fcfa9b82994f6c1ec9c/sofa', changeOrigin: true }));
app.use('/management', proxy({ target: 'http://gz-loc-development00.gz.sftcwl.com:7300/mock/5be14fcfa9b82994f6c1ec9c/sofa', changeOrigin: true }));

const compiler = webpack(webpackConfig);

const devServerOptions = Object.assign({}, webpackConfig.devServer, {
  logLevel: 'warn',
  publicPath: '/',
  silent: true,
  stats: 'errors-only',
});

const middleware = webpackDevMiddleware(compiler, devServerOptions);
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

const fs = middleware.fileSystem;

app.get('*', (req, res) => {
  fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(file.toString());
    }
  });
});

const customHost = process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

app.listen(8080, host, () => {
  console.log('Starting server on http://localhost:8080');
});
