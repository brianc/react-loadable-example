import React from 'react'
import { renderToString } from 'react-dom/server'
import express from 'express'
import App from './components/app'

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
      return `<script src="/scripts/${script}"></script>`
    }).join('\n')}
  </body>
</html>
`

app.get('/empty', (req, res) => {
  res.set('content-type', 'text/html')
  res.end(html('', ['bundle-main.js']))
})

import { StaticRouter } from 'react-router'

app.get('*', (req, res) => {

  const modules = {}
  const bundles = {}

  const webpackStats = res.locals.webpackStats.toJson()

  webpackStats.modules.forEach(module => {
    const parts = module.identifier.split('!')
    const filePath = parts[parts.length - 1]
    modules[filePath] = module.chunks
  })

  webpackStats.chunks.forEach(chunk => {
    bundles[chunk.id] = chunk.files
  })

  const scripts = ['bundle-main.js']

  const requires = []
  const context = {}
  const content = renderToString((
    <StaticRouter location={req.url} context={context}>
      <App requires={requires} />
    </StaticRouter>
  ))

  console.log('context', context)

  requires.forEach(file => {
    let matchedBundles = modules[file + '.js']
    matchedBundles.forEach(bundle => {
      bundles[bundle].forEach(script => {
        scripts.push(script)
      })
    })
  })

  res.set('content-type', 'text/html')
  res.end(html(content, scripts))
})
