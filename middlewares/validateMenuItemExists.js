const { findMenuItemById } = require('../models/menu.js');

async function validateMenuItemExists(req, res, next) {
  const { id } = req.params;

  // Check for product with the given ID
  const existingProduct = await findMenuItemById(id);

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: 'No product found with the given ID',
    });
  }

  next();
}

module.exports = { validateMenuItemExists };
