const express = require('express')
const { server: api } = require('./src/api/index')
const routes = require('./src/routes/index')
const cors = require('cors')

const uploadConfig = require('./src/config/upload')

const port = 8080
const app = express()
const API_ROOT = `http://localhost:${port}/api`

app.use(express.json())
app.use(cors())
app.use('/files', express.static(uploadConfig.tmpFolder))
app.use(routes)
app.use('/api', api)

app.listen(port, (error) => {
  error && console.error(error)
  console.info('Escutando na porta %s. ', port, API_ROOT)
})
