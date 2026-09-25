const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Vanilla Yellow Hues"
  category: { type: String, required: true }, // e.g., "Color", "Silhouette", "Fabric"
  growthRate: { type: String, required: true }, // e.g., "+22%"
  region: { type: String, default: 'Global' }, // e.g., "US / EU"
  sentiment: { type: String, default: 'Surging' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trend', trendSchema);