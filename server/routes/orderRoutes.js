const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', orderController.getOrders);
router.get('/today', orderController.getTodayDeliveries);
router.post('/extra', orderController.orderExtraMeal);

module.exports = router;
