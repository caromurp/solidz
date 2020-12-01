const { Schema, model } = require('mongoose')

const solidzsSchema = new Schema({
  notificationText: String,
  recipient: String,
  sender: String,
})

module.exports = model('Solidzs', solidzsSchema)
