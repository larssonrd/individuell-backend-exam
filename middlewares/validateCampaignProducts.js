const { findMenuItemById } = require('../models/menu');

async function validateCampaignProducts(req, res, next) {
  const products = req.body.products;

  for (let productId of products) {
    const foundProduct = await findMenuItemById(productId);
    if (!foundProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with id ${productId} is not found`,
      });
    }
  }
  next();
}

module.exports = { validateCampaignProducts };
