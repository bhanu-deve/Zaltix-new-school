import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import StudentFee from "../models/StudentFee.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("📥 Create Order Body:", req.body);

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount missing" });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    console.log("📤 Sending to Razorpay:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay Order Created:", order);

    res.json(order);
  } catch (err) {
    console.log("❌ CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to create order" });
  }
};



// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    console.log("📥 Verify Payment Body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feeId,
      paidAmount
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected:", expectedSignature);
    console.log("Received:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {

      const fee = await StudentFee.findById(feeId);

      if (!fee) {
        return res.status(404).json({ error: "Fee not found" });
      }

      fee.paidAmount += Number(paidAmount);

      fee.status =
        fee.paidAmount >= fee.amount
          ? "Paid"
          : fee.paidAmount > 0
          ? "Partial"
          : "Pending";

      await fee.save();

      console.log("✅ Payment Verified & Saved");

      res.json({ success: true });

    } else {
      console.log("❌ Signature mismatch");
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (err) {
    console.log("❌ VERIFY ERROR:", err);
    res.status(500).json({ error: err.message || "Verification failed" });
  }
};

