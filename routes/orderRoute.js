const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  filterOrderForLoggedUser,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliver,
  checkoutSession,
} = require("../services/orderService");

const authRoute = require("../services/authService");

const router = express.Router();

router.use(authRoute.protect);

router.get('/checkout-session/:cartId',authRoute.allowedTo("user"),checkoutSession)

router.route("/:cartId").post(authRoute.allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    authRoute.allowedTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    getAllOrders
  );
router.route("/:id").get(getSpecificOrder);

router
  .route("/:id/pay")
  .put(authRoute.allowedTo("admin", "manager"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authRoute.allowedTo("admin", "manager"), updateOrderToDeliver);

module.exports = router;
