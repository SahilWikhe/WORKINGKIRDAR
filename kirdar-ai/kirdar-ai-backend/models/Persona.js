// models/Persona.js
const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['financial', 'sales', 'medical', 'legal', 'counseling', 'education']
  },
  category: {
    type: String,
  },
  age: {
    type: Number,
    required: true
  },
  // Common fields for all domains
  goals: {
    type: String,
    required: true
  },
  concerns: {
    type: String,
    required: true
  },
  knowledgeLevel: {
    type: String,
    required: true,
    enum: ['Basic', 'Intermediate', 'Advanced']
  },
  // Domain-specific fields stored in a flexible structure
  domainFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Persona', personaSchema);