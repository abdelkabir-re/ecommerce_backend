const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator
} = require("../utils/validators/reviewValidator");

const authRoute = require("../services/authService");

const router = express.Router({mergeParams:true});


router
  .route("/")
  .get(createFilterObject,getReviews)
  .post(
    authRoute.protect,
    authRoute.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator,getReview)
  .delete(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin", "user"),
    deleteReviewValidator,
    deleteReview
  )
  .patch(
    authRoute.protect,
    authRoute.allowedTo("user"),
    updateReviewValidator,
    updateReview
  );
module.exports = router;
