const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true // No two users can have the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  // We will store their custom character designs here later!
  savedAvatars: {
    type: Array,
    default: []
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);