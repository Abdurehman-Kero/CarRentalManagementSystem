// src/routes/reviewRoutes.js
const express = require('express');
const router  = express.Router();
const { getAllReviews, getReviewById, createReview, deleteReview, getReviewStats } = require('../controllers/reviewController');

router.get('/stats',  getReviewStats);
router.get('/',       getAllReviews);    // supports ?carId=X&custId=Y
router.get('/:id',    getReviewById);
router.post('/',      createReview);
router.delete('/:id', deleteReview);

module.exports = router;
