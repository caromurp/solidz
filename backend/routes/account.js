const express = require('express')

const Users = require('../models/users')

const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const all = await Users.find({})
    res.send(all)
  } catch {
    res.send('failure occurs when getting all the users')
  }
})

router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  try {
    await Users.create({ username, password })
    req.session.username = username
    req.session.password = password
    res.send(`${username} created succesfully`)
  } catch {
    res.send('failure occurs when creating the user')
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  Users.findOne({ username, password }, (err, user) => {
    if (user) {
      req.session.username = username
      req.session.password = password
      res.send('logged in')
    } else {
      res.send('failed to log in')
    }
  })
})

router.get('/user', isAuthenticated, (req, res) => {
  res.send(req.session.username)
})

router.get('/isLoggedIn', (req, res) => {
  if (req.session.username === '') {
    res.send(false)
  } else {
    res.send(true)
  }
})

// router.get('/solidz', isAuthenticated, (req, res) => {
//   solidz.find()
// })

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.username = ''
  res.send('user logged out')
})

module.exports = router