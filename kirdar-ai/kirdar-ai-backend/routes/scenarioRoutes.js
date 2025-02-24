// routes/scenarioRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const {
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  resetScenarios,
  generateScenarios,
  refreshScenarios
} = require('../controllers/scenarioController');

// Debug middleware to log basic route info
const debugMiddleware = (req, res, next) => {
  console.log('Scenario route accessed:', {
    method: req.method,
    path: req.path,
    auth: req.headers.authorization ? 'Present' : 'Missing',
    userId: req.user?._id
  });
  next();
};

// Protect all scenario routes (require JWT)
router.use(protect);
// Use debug logging
router.use(debugMiddleware);

// Basic CRUD
router.get('/', getScenarios);                         // GET /api/scenarios
router.post('/', requireAdmin, createScenario);         // POST /api/scenarios
router.put('/:id', requireAdmin, updateScenario);       // PUT /api/scenarios/:id
router.delete('/:id', requireAdmin, deleteScenario);    // DELETE /api/scenarios/:id

// Reset scenarios
router.post('/reset', requireAdmin, resetScenarios);    // POST /api/scenarios/reset

// OpenAI scenario generation
router.post('/generate', requireAdmin, generateScenarios);               // POST /api/scenarios/generate
router.post('/refresh/:domain', requireAdmin, refreshScenarios);         // POST /api/scenarios/refresh/:domain

module.exports = router;
