const mongoose = require('mongoose');

// 1. We design the blueprint (Schema) for an outfit
const outfitSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true // e.g., "Summer Wedding Look"
  },
  occasion: { 
    type: String, 
    default: 'Casual' 
  },
  garments: { 
    type: [String], // An array of strings, e.g., ["Navy Linen Blazer", "White Tee", "Beige Chinos"]
    required: true 
  },
  baseColor: {
    type: String // e.g., "#000080"
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically stamps when the outfit was saved
  }
});

// 2. We compile the blueprint into a Model and export it
module.exports = mongoose.model('Outfit', outfitSchema);