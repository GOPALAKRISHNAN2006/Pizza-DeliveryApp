import cron from "node-cron";
import Inventory from "../model/Inventory.js";
import { sendLowStockAlertEmail } from "../services/emailService.js";

/**
 * Checks all inventory items and triggers alerts for items at/below low stock threshold
 */
export const checkLowStock = async () => {
  try {
    // 1. Reset alert flag for items that have been restocked above threshold
    await Inventory.updateMany(
      {
        $expr: { $gt: ["$quantity", "$lowStockThreshold"] },
        lowStockAlertSent: true
      },
      {
        $set: { lowStockAlertSent: false }
      }
    );

    // 2. Find items at or below threshold where alert has not yet been sent
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
      lowStockAlertSent: { $ne: true }
    });

    if (lowStockItems.length > 0) {
      console.log(`⚠️ Detected ${lowStockItems.length} low stock item(s). Sending alert email...`);
      try {
        await sendLowStockAlertEmail(lowStockItems);

        // Mark alert as sent so we do not spam every 5 minutes
        const itemIds = lowStockItems.map((item) => item._id);
        await Inventory.updateMany(
          { _id: { $in: itemIds } },
          { $set: { lowStockAlertSent: true } }
        );

        console.log(`✅ Low stock alert email dispatched and flags updated for ${lowStockItems.length} items.`);
      } catch (emailErr) {
        console.error("Failed to send low stock alert email:", emailErr.message);
      }
    }
  } catch (error) {
    console.error("Error during low stock inventory check:", error.message);
  }
};

/**
 * Initializes the node-cron scheduled job
 * Runs every 5 minutes in development / production
 */
export const initLowStockCron = () => {
  // Every 5 minutes: '*/5 * * * *'
  const schedule = process.env.LOW_STOCK_CRON_SCHEDULE || "*/5 * * * *";

  console.log(`🕒 Initializing Low Stock Cron job with schedule: "${schedule}"`);
  cron.schedule(schedule, async () => {
    console.log("⏱️ Running scheduled Low Stock Inventory check...");
    await checkLowStock();
  });
};

export default {
  checkLowStock,
  initLowStockCron
};
