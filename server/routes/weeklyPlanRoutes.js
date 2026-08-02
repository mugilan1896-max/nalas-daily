const express = require('express');
const router = express.Router();
const weeklyPlanController = require('../controllers/weeklyPlanController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', weeklyPlanController.getWeeklyPlan);
router.post('/select', weeklyPlanController.selectMeal);
router.post('/skip', weeklyPlanController.skipMeal);
router.post('/pause-day', weeklyPlanController.pauseDay);
router.post('/confirm', weeklyPlanController.confirmWeek);
router.post('/auto-fill', weeklyPlanController.autoFillWeeklyPlan);

module.exports = router;
