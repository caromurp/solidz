const { Schema, model } = require('mongoose')

const solidzSchema = new Schema({
  notificationText: String,
  recipient: String,
  sender: String,
})

module.exports = model('Solidz', solidzSchema)
