const express = require('express')
const Solidzs = require('../models/solidzs')
const isAuthenticated = require('../middlewares/isAuthenticated')
const Users = require('../models/users')

const router = express.Router()

// gets all solidz for feed
router.get('/', async (req, res) => {
  try {
    console.log("getting all the solidz")
    const all = await Solidzs.find({})
    res.send(all)
  } catch {
    res.send('failure occurs when getting all the solidz')
  }
})

// gets all solidz for user
router.get('/user/:username', async (req, res) => {
  const { username } = req.params
  try {
    console.log("getting all the solidz FOR A USER")
    const allReceived = await Solidzs.find({ recipient: username })
    const allSent = await Solidzs.find({ sender: username })
    res.send({ solidz: allReceived.concat(allSent), numSolidz: allReceived.length })
  } catch {
    res.send('failure occurs when getting all OF THSI GUYS solidz')
  }
})

// send a solid to someone
router.post('/send', isAuthenticated, async (req, res) => {
  const { notificationText, recipient, sender } = req.body
  try {
    console.log("making solid! (in backend)")
    console.log(req.body)
    await Solidzs.create({ notificationText, recipient, sender })
    const recipientUser = await Users.findOne({ username: recipient }) 
    console.log(recipientUser)
    await Users.updateOne({ username: recipient }, { $set: recipientUser.numSolidz + 1 })
    res.send(`sent solid: ${notificationText} to: ${recipient} from: ${sender}`)
  } catch {
    res.send('failure occurs when sending the solid')
  }
})

module.exports = router
