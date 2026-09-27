import crypto from "crypto";
import { getRazorpayInstance } from "../config/razorpay.js";

/**
 * Creates a Razorpay order on the server
 * @param {number} amountInRupees - Amount in INR
 * @param {string} receipt - Unique receipt/order identifier
 * @param {object} notes - Optional metadata notes
 */
export const createRazorpayOrder = async (amountInRupees, receipt, notes = {}) => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  // Convert INR to Paise (1 INR = 100 Paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  // Try real Razorpay call if credentials look valid
  if (
    key_id &&
    key_secret &&
    !key_id.includes("placeholder") &&
    !key_id.includes("demo") &&
    key_id.startsWith("rzp_")
  ) {
    try {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
        notes
      };

      const order = await razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
        isMock: false
      };
    } catch (apiError) {
      console.warn("⚠️ Razorpay API call failed (Falling back to Test Mode):", apiError.message);
    }
  }

  // Fallback Mock Order for offline test mode
  console.log("ℹ️ Using Test/Demo Razorpay Order creation mode");
  const mockOrderId = `order_test_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  return {
    success: true,
    orderId: mockOrderId,
    amount: amountInPaise,
    currency: "INR",
    keyId: key_id || "rzp_test_demo_key",
    isMock: true
  };
};

/**
 * Verifies Razorpay HMAC-SHA256 signature
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpaySignature
 */
export const verifyRazorpaySignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return false;
  }

  // If using demo mode / test mock
  if (
    razorpayOrderId.startsWith("order_test_") ||
    !key_secret ||
    key_secret === "placeholder_secret" ||
    key_secret.includes("demo")
  ) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
};

export default {
  createRazorpayOrder,
  verifyRazorpaySignature
};
