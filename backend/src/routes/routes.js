const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const walletController = require('../controllers/walletController');

module.exports = [
  // USER ROUTES
  {
    method: 'POST',
    url: '/user',
    handler: userController.createUser
  },
  {
    method: 'DELETE',
    url: '/user/:id',
    handler: userController.deleteUser,
    protected: true
  },
  {
    method: 'PUT',
    url: '/user/:id',
    handler: userController.updateUser,
    protected: true
  },
  {
    method: 'GET',
    url: '/user/:id',
    handler: userController.getUser,
    protected: true
  },
  // WALLET ROUTES
  {
    method: 'POST',
    url: '/user/:id/buy-crypto',
    handler: walletController.buyCrypto,
    protected: true
  },
  {
    method: 'POST',
    url: '/user/:id/sell-crypto',
    handler: walletController.sellCrypto,
    protected: true
  },
  {
    method: 'GET',
    url: '/wallet/:id',
    handler: walletController.getWalletInfo,
    protected: true
  },
  // AUTH ROUTES
  {
    method: 'POST',
    url: '/login',
    handler: authController.login
  },
]