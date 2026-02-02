import dotenv from "dotenv";
dotenv.config(); // 🔥 ADD THIS HERE

import Razorpay from "razorpay";

console.log("Loaded Key:", process.env.RAZORPAY_KEY_ID); // debug

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);


export default razorpay;
