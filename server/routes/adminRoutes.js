const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const adminAuthMiddleware = require('../middlewares/adminAuth');

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router.get('/stats', adminController.getAdminStats);
router.get('/meals', adminController.getAdminMeals);
router.post('/meals', adminController.addMeal);
router.put('/meals/:id', adminController.updateMeal);
router.delete('/meals/:id', adminController.deleteMeal);
router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
