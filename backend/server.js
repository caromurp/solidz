const mongoose = require('mongoose')
const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')

const APIRouter = require('./routes/api')
const AccountRouter = require('./routes/account')

const isAuthenticated = require('./middlewares/isAuthenticated')

const app = express()

const MONGO_URI = 'mongodb://localhost:27017/solidz'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

app.use(express.json())
app.use(express.static('dist'))

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.use('/api', APIRouter)
app.use('/account', AccountRouter)
app.use(isAuthenticated)

app.get('/favicon.ico', (_, res) => res.status(404).send())
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.use(function (err, req, res, next) {
  res.status(400).send(err.message)
})

app.listen(3000, () => {
  console.log('listening on 3000')
})