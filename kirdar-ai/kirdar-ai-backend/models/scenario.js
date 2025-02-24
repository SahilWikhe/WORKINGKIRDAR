// models/Scenario.js
const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['financial', 'sales', 'medical', 'legal', 'counseling', 'education'],
    default: 'financial'
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  iconType: {
    type: String,
    default: 'Target'
  },
  difficulty: {
    type: String,
    enum: ['Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  objectives: [{
    type: String
  }],
  estimatedTime: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
scenarioSchema.index({ domain: 1, category: 1, subCategory: 1, difficulty: 1 });
scenarioSchema.index({ isActive: 1 });

// Check if the model exists before creating it
module.exports = mongoose.models.Scenario || mongoose.model('Scenario', scenarioSchema);