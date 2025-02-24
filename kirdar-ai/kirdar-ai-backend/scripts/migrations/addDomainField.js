// scripts/migrations/addDomainField.js
const mongoose = require('mongoose');
const Scenario = require('../../models/scenario');
require('dotenv').config();

const migrateDomains = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing scenarios without a domain to be 'financial'
    const result = await Scenario.updateMany(
      { domain: { $exists: false } },
      { $set: { domain: 'financial' } }
    );

    console.log(`Updated ${result.modifiedCount} scenarios`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDomains()
    .then(() => console.log('Migration script completed'))
    .catch(err => console.error('Migration script failed:', err));
}

module.exports = migrateDomains;