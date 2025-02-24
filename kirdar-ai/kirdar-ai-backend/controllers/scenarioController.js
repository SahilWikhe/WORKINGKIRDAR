// controllers/scenarioController.js

const OpenAI = require('openai');
const Scenario = require('../models/scenario');
const ScenarioAssignment = require('../models/ScenarioAssignment');
const User = require('../models/User');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Default/seed scenarios array (with domain added for each scenario)
const defaultScenarios = [
  {
    domain: 'financial',
    title: "Portfolio Diversification Strategy",
    category: "Investment Planning",
    description: "A high-net-worth client seeks guidance on diversifying...",
    difficulty: "Intermediate",
    objectives: [
      "Assess current portfolio concentration risk",
      "Explain diversification principles",
      "Recommend optimal asset allocation",
      "Address concerns about potential return impact"
    ],
    estimatedTime: "20-25 min",
    iconType: "Target"
  },
  {
    domain: 'financial',
    title: "ESG Investment Integration",
    category: "Investment Planning",
    description: "A client wants to align their portfolio with environmental...",
    difficulty: "Advanced",
    objectives: [
      "Define ESG investment criteria",
      "Maintain portfolio diversification",
      "Monitor ESG impact and performance",
      "Balance values with returns"
    ],
    estimatedTime: "25-30 min",
    iconType: "Target"
  },
  // ... add ALL other scenarios here ...
];

// -----------------------------------------------------------------------------
// OLD (ORIGINAL) CONTROLLER FUNCTIONS
// -----------------------------------------------------------------------------

// @desc    Get all scenarios
// @route   GET /api/scenarios
// @access  Private
const getScenarios = async (req, res) => {
  try {
    console.log('Fetching scenarios...');
    const { domain } = req.query;

    let query = { isActive: true };
    if (domain) {
      query.domain = domain;
    }

    // If user is admin, return all active scenarios
    if (req.user.isAdmin) {
      let scenarios = await Scenario.find(query)
        .sort({ domain: 1, category: 1, difficulty: 1 });

      // If no scenarios exist for this domain, seed with defaults
      if (scenarios.length === 0 && domain) {
        console.log(`No scenarios found for domain ${domain}, generating...`);
        
        // Use the existing generateScenarios logic
        const generatedScenarios = await generateScenariosForDomain(domain, req.user._id);
        return res.json(generatedScenarios);
      }

      return res.json(scenarios);
    }

    // For trainees (non-admins), only return assigned + active scenarios
    const assignments = await ScenarioAssignment.find({
      userId: req.user._id,
      status: 'active'
    }).populate('scenarioId');

    const scenarios = assignments
      .map(assignment => assignment.scenarioId)
      .filter(scenario => scenario && scenario.isActive && (!domain || scenario.domain === domain));

    console.log(`Returning ${scenarios.length} assigned scenarios for trainee ${req.user._id}`);
    return res.json(scenarios);

  } catch (error) {
    console.error('Error in getScenarios:', error);
    res.status(500).json({ message: 'Error fetching scenarios' });
  }
};

// Helper function to generate scenarios for a domain
const generateScenariosForDomain = async (domain, userId) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "system", 
        content: `You are an expert ${domain} training scenario creator.` 
      },
      { 
        role: "user", 
        content: `Generate 5 professional training scenarios for ${domain} practitioners.
          Each scenario should include:
          1. A title
          2. A detailed description
          3. Difficulty level (Intermediate, Advanced, or Expert)
          4. 3-4 specific learning objectives
          5. Estimated time (in minutes)
          
          Return in JSON format with scenarios array.`
      }
    ],
    temperature: 0.8
  });

  const generatedContent = JSON.parse(completion.choices[0].message.content);

  // Save new scenarios in DB
  const scenariosToSave = generatedContent.scenarios.map(scenario => ({
    ...scenario,
    domain,
    createdBy: userId,
    isActive: true
  }));

  return await Scenario.insertMany(scenariosToSave);
};

// @desc    Create new scenario
// @route   POST /api/scenarios
// @access  Private/Admin
const createScenario = async (req, res) => {
  try {
    // Validate domain (optional; adjust domains as needed)
    if (
      !req.body.domain ||
      !['financial', 'medical', 'legal', 'counseling', 'education'].includes(req.body.domain)
    ) {
      return res.status(400).json({ message: 'Invalid domain specified' });
    }

    console.log('Creating new scenario:', req.body);
    const scenario = new Scenario({
      ...req.body,
      createdBy: req.user._id
    });

    const savedScenario = await scenario.save();
    console.log('Created scenario:', savedScenario);
    res.status(201).json(savedScenario);
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update scenario
// @route   PUT /api/scenarios/:id
// @access  Private/Admin
const updateScenario = async (req, res) => {
  try {
    console.log('Updating scenario:', req.params.id);
    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    console.log('Updated scenario:', scenario);
    res.json(scenario);
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete scenario (soft delete by setting isActive: false)
// @route   DELETE /api/scenarios/:id
// @access  Private/Admin
const deleteScenario = async (req, res) => {
  try {
    console.log('Deleting scenario:', req.params.id);
    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    console.log('Deleted scenario (soft):', scenario._id);
    res.json({ message: 'Scenario deleted successfully' });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reset scenarios to defaults
// @route   POST /api/scenarios/reset
// @access  Private/Admin
const resetScenarios = async (req, res) => {
  try {
    console.log('Starting scenarios reset...');

    // Delete all existing scenarios
    await Scenario.deleteMany({});
    console.log('Deleted existing scenarios');

    // Create default scenarios fresh
    const scenarios = await Scenario.insertMany(
      defaultScenarios.map(scenario => ({
        ...scenario,
        createdBy: req.user._id,
        isActive: true
      }))
    );

    console.log(`Created ${scenarios.length} new scenarios`);
    res.status(200).json({
      message: 'Database reset successful',
      scenarios
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ message: 'Failed to reset database' });
  }
};

// -----------------------------------------------------------------------------
// NEW (OPENAI) CONTROLLER FUNCTIONS
// -----------------------------------------------------------------------------

// @desc    Generate scenarios via OpenAI for a given domain
// @route   POST /api/scenarios/generate
// @access  Private/Admin
const generateScenarios = async (req, res) => {
  try {
    const { domain, category, subCategory } = req.body;

    // Build context-specific prompt
    let prompt = `Generate 5 professional training scenarios for ${domain} practitioners`;
    
    if (category) {
      prompt += ` specifically for ${category}`;
      if (subCategory) {
        prompt += ` in the ${subCategory} sector`;
      }
    }

    prompt += `.\nEach scenario should be realistic and challenging, including:
    1. A title
    2. A detailed description of the client situation
    3. Difficulty level (Intermediate, Advanced, or Expert)
    4. 3-4 specific learning objectives
    5. Estimated time (in minutes)
    6. Key points or client profile details

    Return them in this exact JSON format:
    {
      "scenarios": [
        {
          "title": "string",
          "category": "${category || 'string'}",
          "subCategory": "${subCategory || 'string'}",
          "description": "string",
          "difficulty": "string",
          "objectives": ["string"],
          "estimatedTime": "string",
          "keyPoints": ["string"]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are an expert ${domain} training scenario creator, specializing in ${category || domain} scenarios.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content);

    // Save new scenarios in DB
    const scenariosToSave = generatedContent.scenarios.map(scenario => ({
      ...scenario,
      domain,
      category: category || scenario.category,
      subCategory: subCategory || scenario.subCategory,
      createdBy: req.user._id,
      isActive: true
    }));

    const savedScenarios = await Scenario.insertMany(scenariosToSave);
    res.json(savedScenarios);
  } catch (error) {
    console.error('Error generating scenarios:', error);
    res.status(500).json({ message: 'Failed to generate scenarios' });
  }
};

// @desc    Refresh scenarios for a domain (deletes and regenerates)
// @route   POST /api/scenarios/refresh/:domain
// @access  Private/Admin
const refreshScenarios = async (req, res) => {
  try {
    const { domain } = req.params;

    // Delete existing scenarios for this domain
    await Scenario.deleteMany({ domain });

    // Reuse generateScenarios logic. We can artificially call it,
    // but we'll replicate the body param so it can read domain from req.body
    req.body.domain = domain;

    // Let's run generateScenarios inside our function
    const originalSend = res.send.bind(res); // or you can do something else
    let generatedResult;

    // Temporarily override res.send to capture the result from generateScenarios
    res.send = (data) => {
      generatedResult = data;
      return originalSend(data);
    };

    await generateScenarios(req, res);

    // Restore res.send
    res.send = originalSend;

    // If needed, you could return your own custom message:
    // But currently, generateScenarios will have already sent the newly generated scenarios
    // So an alternative approach would be:
    // res.json({ message: "Refreshed scenarios", data: generatedResult });

  } catch (error) {
    console.error('Error refreshing scenarios:', error);
    res.status(500).json({ message: 'Failed to refresh scenarios' });
  }
};

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
module.exports = {
  // Existing exports
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  resetScenarios,
  defaultScenarios, // optional if you need it

  // New exports
  generateScenarios,
  refreshScenarios
};
