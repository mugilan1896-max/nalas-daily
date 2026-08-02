const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.post('/profile', userController.saveProfile);
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id/default', userController.setDefaultAddress);

module.exports = router;
