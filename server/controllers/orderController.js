// controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import Address from "../models/Address.js";

// ✅ COD Order
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !Array.isArray(items) || !items.length || !address) {
      return res.json({ success: false, message: "Missing userId, items, or address" });
    }

    let addressSnapshot;

    if (typeof address === "string" && address.trim().length > 0) {
      const savedAddress = await Address.findById(address.trim());
      if (!savedAddress) {
        return res.json({ success: false, message: "Address ID not found" });
      }
      addressSnapshot = savedAddress.toObject();
      delete addressSnapshot._id; // optional
      delete addressSnapshot.__v; // optional
    } else if (typeof address === "object" && Object.keys(address).length > 0) {
      addressSnapshot = { ...address, userId }; // Use inline address
    } else {
      return res.json({ success: false, message: "Invalid address format" });
    }

    console.log("✅ Final address snapshot:", addressSnapshot);

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.json({ success: false, message: `Product not found: ${item.product}` });
      const variant = product.variants[item.variantIndex];
      if (!variant) return res.json({ success: false, message: "Invalid variant index" });
      amount += variant.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    await Order.create({
      userId,
      items,
      amount,
      address: addressSnapshot, // ✅ Embed full snapshot
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order placed successfully (COD)" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};




// ✅ Razorpay Order
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !Array.isArray(items) || !items.length || !address) {
      return res.json({ success: false, message: "Missing userId, items, or address" });
    }

    if (typeof address !== "object" || !Object.keys(address).length) {
      return res.json({ success: false, message: "Address must be a valid object" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.json({ success: false, message: `Product not found: ${item.product}` });

      const variant = product.variants[item.variantIndex];
      if (!variant) return res.json({ success: false, message: "Invalid variant index" });

      amount += variant.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address, // ✅ snapshot stored directly
      paymentType: "Online",
    });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amount * 100, // to paise
      currency: "INR",
      receipt: `order_rcptid_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      orderDbId: order._id,
    });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};



// ✅ Razorpay Verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId,
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      return res.json({ success: true, message: "Payment verified" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Get Orders for User
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        populate: { path: "category" },
      })
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Get All Orders (Seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate({
        path: "items.product",
        populate: { path: "category" },
      })
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
