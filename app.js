// Middleware import
const {
  checkUsernameMatch,
  checkPasswordMatch,
  checkUsernameAvailabilitiy,
  checkPasswordSecurity,
} = require('./middlewares/auth');
const {
  validateUserId,
  validateUserIdOrGuest,
} = require('./middlewares/validateUser');
const { checkProducts } = require('./middlewares/checkProducts');
const { validateOrderNr } = require('./middlewares/validateOrderNr');
const { calcDeliveryTime } = require('./middlewares/calcDeliveryTime');
const { validateNewProduct } = require('./middlewares/validateNewProduct');
const {
  validateMenuItemExists,
} = require('./middlewares/validateMenuItemExists');
const {
  calculateTotalPrice,
} = require('./middlewares/calculateTotalPrice');
const { checkAdmin } = require('./middlewares/checkAdmin');
const {
  validateCampaignProducts,
} = require('./middlewares/validateCampaignProducts');

// Database import
const { createUser, getAllUsers } = require('./models/users');
const {
  getAllMenuItems,
  saveToMenu,
  modifyMenuItem,
  deleteFromMenu,
} = require('./models/menu');
const { saveToOrders, findOrdersByUserId } = require('./models/orders');
const { saveToCampaigns } = require('./models/campaigns');

require('dotenv').config();

const { uuid } = require('uuidv4');
const express = require('express');
const app = express();

const port = 5000;

app.use(express.json());

// Get menu
app.get('/api/menu', async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await getAllMenuItems() });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch from database',
      error: err.code,
    });
  }
});

// Place order
app.post(
  '/api/order/:userId',
  validateUserIdOrGuest,
  checkProducts,
  calculateTotalPrice,
  async (req, res) => {
    const order = {
      userId: req.params.userId,
      orderNr: uuid(),
      orderTime: new Date(),
      deliveryTime: new Date(new Date().getTime() + 20 * 60000), // 20 minutes
      totalPrice: res.locals.totalPrice,
      products: res.locals.products,
    };

    try {
      await saveToOrders(order); // Adds order to database
      res.json({
        success: true,
        message: 'Order placed successfully',
        eta: 20,
        orderNr: order.orderNr,
        totalPrice: order.totalPrice,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Could not fetch from database',
        error: err.code,
      });
    }
  }
);

// Signup new user
app.post(
  '/api/user/signup',
  checkUsernameAvailabilitiy,
  checkPasswordSecurity,
  async (req, res) => {
    try {
      const user = {
        username: req.body.username,
        password: req.body.password,
        userId: uuid(),
        role: 'user',
      };
      await createUser(user); // Adds user to database
      res
        .status(201)
        .json({ success: true, message: 'The account has been created' });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while creating user',
        error: err.code,
      });
    }
  }
);

// Login user
app.post(
  '/api/user/login',
  checkUsernameMatch,
  checkPasswordMatch,
  async (req, res) => {
    try {
      const { username } = req.body;
      const usersList = await getAllUsers();
      const matchedUser = usersList.find(
        (user) => user.username === username
      );
      // Skapar en token som inkluderar användarens roll och id
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { role: matchedUser.role, userId: matchedUser.userId },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.json({ success: true, isLoggedIn: true, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while logging in user',
        error: err.message,
      });
    }
  }
);

// Get user history
app.get('/api/user/:userId/history', validateUserId, async (req, res) => {
  const userId = req.params.userId;

  try {
    const orderHistory = await findOrdersByUserId(userId);
    res.json({ success: true, orderHistory });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error occurred while getting orderHistory',
      error: err.code,
    });
  }
});

// Get order status
app.get(
  '/api/order/status/:ordernr',
  validateOrderNr,
  calcDeliveryTime,
  async (req, res) => {
    try {
      res.json({
        success: true,
        timeLeft: res.locals.timeLeft,
        isDelivered: res.locals.timeLeft <= 0 ? true : false,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while getting status of order',
        code: err.code,
      });
    }
  }
);

///////// INDIVIDUELL EXAMINATION //////////

// Add a menu item
app.post(
  '/api/admin/menu/add',
  checkAdmin,
  validateNewProduct,
  async (req, res) => {
    // Add the menu item to the database
    const newProduct = await saveToMenu(req.body); // Assuming the request body contains the new menu item details
    res.json({
      success: true,
      message: 'Menu item added successfully',
      product: newProduct,
    });
  }
);

// Modify the menu item in the database
app.patch(
  '/api/admin/menu/modify/:id',
  checkAdmin,
  validateMenuItemExists,
  async (req, res) => {
    await modifyMenuItem(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Menu item modified successfully',
    });
  }
);

// Remove a menu item
app.delete(
  '/api/admin/menu/remove/:id',
  checkAdmin,
  validateMenuItemExists,
  async (req, res) => {
    await deleteFromMenu(req.params.id);
    res.json({ success: true, message: 'Menu item removed successfully' });
  }
);

// Add campaign
app.post(
  '/api/admin/campaign',
  checkAdmin,
  validateCampaignProducts,
  async (req, res) => {
    const { products, price } = req.body;

    try {
      const campaign = await saveToCampaigns({ products, price });
      res.status(201).json({ success: true, campaign });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while adding campaign',
        error: err.code,
      });
    }
  }
);

////////// SLUT INDIVIDUELL EXAMINATION ///////////

app.listen(port, () => {
  console.log('Server listening on ' + port);
});
