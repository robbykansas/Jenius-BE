const express = require('express')
const mongoose = require('mongoose')
const app = express()
const routes = require('./routes')
const url = "mongodb+srv://robby:lomiver@cluster0.xqrrd.mongodb.net/test?retryWrites=true&w=majority"
const errorHandler = require('./middleware/errorHandler')

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)
app.use(errorHandler)

module.exports = app