const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/auth');

router.get('/plans', subscriptionController.getPlans);
router.get('/current', authMiddleware, subscriptionController.getCurrentSubscription);
router.post('/subscribe', authMiddleware, subscriptionController.subscribe);
router.post('/pause', authMiddleware, subscriptionController.pauseSubscription);
router.post('/resume', authMiddleware, subscriptionController.resumeSubscription);

module.exports = router;
