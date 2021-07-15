require('dotenv/config');
const express = require('express')
const app = express()
const consign = require('consign')
const db = require('./src/config/db')

consign({ cwd: 'src' })
    .then('./config/middlewares.js')
    .then('./services')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

app.listen(process.env.PORT, () => {
    console.log(`Backend executando na porta ${process.env.PORT}`)
})