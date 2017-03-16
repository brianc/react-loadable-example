import React from 'react'
import { renderToString } from 'react-dom/server'
import express from 'express'
import App from './components'

const app = express()
export default app

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpack from 'webpack'
import webpackConfig from './webpack.config'

const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, {
  stats: 'minimal',
  serverSideRender: true,
  publicPath: '/scripts/',
}))

const html = (contents, scripts) => `
<!doctype html>
<html>
  <body>
    <div id='root'>${contents}</div>
    ${scripts.map(script => {
      return `<script src="scripts/${script}"></script>`
    }).join('\n')}
  </body>
</html>
`

app.get('/empty', (req, res) => {
  res.set('content-type', 'text/html')
  res.end(html('', ['bundle-main.js']))
})

app.get('/', (req, res) => {
  console.log('got request')

  let modules = {};
  let bundles = {};

  const webpackStats = res.locals.webpackStats.toJson()

  webpackStats.modules.forEach(module => {
    let parts = module.identifier.split('!');
    let filePath = parts[parts.length - 1];
    modules[filePath] = module.chunks;
  });

  webpackStats.chunks.forEach(chunk => {
    bundles[chunk.id] = chunk.files;
  });

  let scripts = ['bundle-main.js'];

  const requires = []
  const content = renderToString(<App requires={requires} />)


  requires.forEach(file => {
    let matchedBundles = modules[file + '.js'];
    matchedBundles.forEach(bundle => {
      bundles[bundle].forEach(script => {
        scripts.push(script);
      });
    });
  });

  res.set('content-type', 'text/html')
  res.end(html(content, scripts))
})
