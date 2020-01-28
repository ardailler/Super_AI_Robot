//models/User.js

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose;

// Define schema for user items
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({error: 'Invalid Email address'})
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    validate: value => {
      if (value.length < 7) {
        throw new Error('Password too short (min 7 char)')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  webClient: {
    type: String,
    default: ''
  },
  webIsAlive: {
    type: Boolean,
    default: false
  },
  appClient: {
    type: String,
    default: ''
  },
  appIsAlive: {
    type: Boolean,
    default: false
  },
  historique: [{
    orientation: {
      type : String
    },
    distance: {
      type : String
    }
  }]
}, {
  timestamps: true
})


userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, { expiresIn: 60 * 120 })
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}

userSchema.statics.updateWebClient = async (_id, client_id, client_alive) => {
  // Search for a user by email and password.
  try {
    const user = await User.findById(_id)
    user.webClient = client_id
    user.webIsAlive = client_alive
    await user.save()
    return user
  } catch (err) {
    console.log(err)
    return err
  }
}

userSchema.statics.updateAppClient = async (_id, client_id, client_alive) => {
  // Search for a user by email and password.
  try {
    const user = await User.findById(_id)
    user.appClient = client_id
    user.appIsAlive = client_alive
    await user.save()
    return user
  } catch (err) {
    console.log(err)
    return err
  }
}



userSchema.statics.addHistorique = async (_id, orientation, distance) => {
  // Search for a user by email and password.
  try {
    const user = await User.findById(_id)
    user.historique = user.historique.concat({
      orientation: orientation,
      distance: distance
    })
    if (user.historique.length > 8) {
      user.historique.shift()
    }
    await user.save()
    return user
  } catch (err) {
    console.log(err)
    return err
  }
}


userSchema.statics.getHistorique = async (_id) => {
  // Search for a user by email and password.
  try {
    const user = await User.findById(_id)
    let hist = ""
    let counter = 1
    for (let histo of user.historique) {
      hist += histo.orientation + "," + histo.distance
      if (counter < user.historique.length) {
        hist += ","
      }
      counter++
    }
    return hist
  } catch (err) {
    console.log(err)
    return err
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;