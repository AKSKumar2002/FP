import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

// ✅ Update Razorpay instance to use live keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID); // ✅ Debug: Check if live key is being used

// ✅ 1️⃣ Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // ✅ FIXED: Calculate Amount properly
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      const variant = product.variants[item.variantIndex];
      amount += variant.offerPrice * item.quantity;
    }
    amount += amount * 0.02;


    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);


    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// ✅ 2️⃣ Place Order Razorpay : /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    // Basic validation
    if (!userId || !items?.length || !address) {
      return res.json({ success: false, message: "Missing data" });
    }

    let amount = 0;

    // Calculate base amount
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      const variant = product.variants[item.variantIndex];
      if (!variant) {
        return res.json({ success: false, message: "Variant not found" });
      }

      amount += variant.offerPrice * item.quantity;
    }

<<<<<<< HEAD
    // Add 2% tax (only once)
    amount += amount * 0.02;
    amount = Math.round(amount);
=======
    // Add 2% tax ONCE
    amount = amount + amount * 0.02;
>>>>>>> c0962d05e69be81dac399094af272e35b0de3850

    // Round off to nearest rupee
    amount = Math.round(amount);

    if (amount <= 0) {
      return res.json({ success: false, message: "Invalid order amount" });
    }

    // Create order in DB
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_rcptid_${order._id}`,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
      console.log("Razorpay order response:", razorpayOrder);
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      return res.json({ success: false, message: "Razorpay API error", error: err });
    }

    if (!razorpayOrder || !razorpayOrder.id) {
      return res.json({ success: false, message: "Failed to create Razorpay order", error: razorpayOrder });
    }

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      orderDbId: order._id,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("OrderController error:", error);
    return res.json({ success: false, message: error.message, error });
=======
    console.error("Razorpay create order error:", error.error || error.message || error);
    return res.json({
      success: false,
      message: error.error?.description || error.message || "Something went wrong",
      details: error.error || null
    });
>>>>>>> c0962d05e69be81dac399094af272e35b0de3850
  }
};


// ✅ 3️⃣ Verify Razorpay Payment : /api/order/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId,
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      return res.json({ success: true, message: "Payment Verified" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Verification Failed" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ 4️⃣ Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        populate: {
          path: "category",
          model: "Category",
        },
      })
      .populate("address")

      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ 5️⃣ Get All Orders : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        populate: {
          path: "category",
          model: "Category",
        },
      })
      .populate("address")

      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ 6️⃣ Update Order Status : /api/order/status/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, order: updatedOrder, message: "Status updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};