const { findMenuItemByTitle } = require('../models/menu');

async function validateNewProduct(req, res, next) {
  const { title, desc, price } = req.body;

  // Check if all necessary fields exist
  if (!title || !desc || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain a title, description, and price',
    });
  }

  // Check for product with the same title
  const existingProduct = await findMenuItemByTitle(title);

  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: 'A product with this title already exists',
    });
  }

  next();
}

module.exports = { validateNewProduct };
