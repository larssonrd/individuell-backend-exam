const nedb = require('nedb-promise');
campaignsDb = new nedb({
  filename: './databases/campaigns.db',
  autoload: true,
});

async function saveToCampaigns(campaign) {
  return await campaignsDb.insert(campaign);
}

module.exports = { saveToCampaigns };
