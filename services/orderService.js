const stripe = require("stripe")(process.env.STRIPE_SECRETE);
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

// @desc create cash order
// @route post api/v1/orders/cartId
// @access protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart with this id ${req.params.cartId}`, 404)
    );
  }

  // 2) get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3) create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) after creating order, decrement product quantity,increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5) clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "user") filterObject = { user: req.user._id };
  req.filterObject = filterObject;
  next();
};

exports.getAllOrders = factory.getAll(Order);

exports.getSpecificOrder = factory.getOne(Order);

// @desc update order status to paid
// @route put api/v1/orders/:id/pay
// @access protected/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such an order with user ${req.user._id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc update order status to deliverr
// @route put api/v1/orders/:id/deliver
// @access protected/admin-manager
exports.updateOrderToDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such an order with user ${req.user._id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc get checkout session from stripe and send it as response
// @route get api/v1/orders/checkout-session/cartId
// @access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart with this id ${req.params.cartId}`, 404)
    );
  }
  // 2) get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3)create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "MAD",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `https://localhost:5173/orders`,
    cancel_url: `https://localhost:5173/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  //4)send session to response
  res.status(200).json({ status: "success", session });
});

const createCartOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //3) create order with default paymentMethodType cash
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) after creating order, decrement product quantity,increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5) clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc this webhook will run when stripe payment success paid
// @route post /webhook-checkout
// @access protected/user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error:${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCartOrder(event.data.object);
  }
});
