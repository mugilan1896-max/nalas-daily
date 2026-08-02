const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

router.get('/', mealController.getMeals);
router.get('/:id', mealController.getMealById);

module.exports = router;
