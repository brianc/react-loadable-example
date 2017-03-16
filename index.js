require('babel-register')({
  presets: ['es2015', 'stage-2', 'react'],
  plugins: ['dynamic-import-node', 'syntax-dynamic-import'],
})

const app = require('./app')
const http = require('http')
const port = process.env.PORT || 3000
http.createServer(app.default)
  .listen(port, () => console.log(`listening on ${port}...`))
