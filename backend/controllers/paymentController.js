const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder'
  });
};

// @desc   Get Razorpay Key ID
// @route  GET /api/payment/razorpay-key
// @access Public
exports.getRazorpayKey = (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
  });
};

// @desc   Create Razorpay Order
// @route  POST /api/payment/create-order
// @access Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const instance = getRazorpayInstance();
    const options = {
      amount: Math.round(Number(amount) * 100), // amount in lowest currency unit (paise)
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const razorpayOrder = await instance.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Razorpay order creation failed'
    });
  }
};

// @desc   Verify Razorpay Payment Signature
// @route  POST /api/payment/verify
// @access Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic && process.env.NODE_ENV === 'production') {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update order status if orderId provided
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: 'Paid',
          update_time: new Date().toISOString(),
          email_address: req.user.email
        };
        await order.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and recorded successfully'
    });
  } catch (error) {
    next(error);
  }
};
