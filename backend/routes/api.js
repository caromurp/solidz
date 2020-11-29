const express = require('express')
const Solidz = require('../models/solidz')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

// gets all solidz for feed
router.get('/', async (req, res) => {
  try {
    const all = await Solidz.find({})
    res.send(all)
  } catch {
    res.send('failure occurs when getting all the solidz')
  }
})

// send a solid to someone
router.post('/send', isAuthenticated, async (req, res) => {
  const { notificationText, recipient, sender } = req.body
  try {
    console.log("making solid! (in backend)")
    await Solidz.create({ notificationText, recipient, sender })
    res.send(`sent solid: ${notificationText} to: ${recipient} from: ${sender}`)
  } catch {
    res.send('failure occurs when sending the solid')
  }
})

// router.post('/answer', isAuthenticated, async (req, res) => {
//   const { _id, answer } = req.body
//   try {
//     await Questions.updateOne({ _id }, { $set: { answer } })
//     res.send('question updated')
//   } catch (e) {
//     res.send('failure occurs when creating the question')
//   }
// })

module.exports = router
