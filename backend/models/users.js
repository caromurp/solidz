const { Schema, model } = require('mongoose')

const usersSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
})

module.exports = model('Users', usersSchema)
