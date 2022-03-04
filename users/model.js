const mongoose = require('mongoose')     // import Mongoose library
const Schema = mongoose.Schema         // use schema object to create then the schema

const userSchema = new Schema({       // instantiate schema object
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken:{
    type: String
  },
  createDate: {
    type: Date,
    required: true,
    default: new Date()
  }
})

// create the schema from the model:
const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel