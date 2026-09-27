import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret
    });
  }
  return razorpayInstance;
};

export default getRazorpayInstance;
