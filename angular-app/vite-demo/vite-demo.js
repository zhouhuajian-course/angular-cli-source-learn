import { createServer } from "vite";
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  This is a home page in memory.
</body>
</html>`
const server = await createServer({
  server: {
    host: 'localhost',
    port: 3000
  },
  root: './src',
  plugins: [{
    name: 'plugin-demo',
    configureServer: async (server) => {
      // request response
      server.middlewares.use((req, res, next) => {
        if (req.url == '/') {
          req.url = '/index.html'
        }
        next()
      })
      server.middlewares.use((req, res, next) => {
        console.log(req.url) // http://localhost:3000/
        // if (req.url == '/index.html' || req.url == '/') {
        if (req.url == '/index.html') {
          res.statusCode = 200
          res.end(indexHtml)
        } else {
          res.statusCode = 404
          res.end()
        }
        // console.log(req.method)
        // res.write("Hello")
        // res.write(" World")
        // res.end("!")
      })

      return async () => {
        server.middlewares.use((req, res, next) => {

        })
        console.log(server.middlewares.stack);
        
      }
    }
  }]
})
await server.listen() // http://localhost:3000/index.html
server.printUrls()
server.bindCLIShortcuts({
  print: true
})