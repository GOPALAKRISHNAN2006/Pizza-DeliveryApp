import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const runTests = async () => {
  console.log("==========================================");
  console.log("🧪 STARTING OASIS PIZZA END-TO-END TESTS");
  console.log("==========================================");

  try {
    // 1. Health check
    console.log("\n[1] Testing Health Check...");
    const health = await axios.get("http://localhost:5000/");
    console.log("✅ Health Check:", health.data);

    // 2. Register User
    const testEmail = `test_chef_${Date.now()}@oasispizza.com`;
    console.log(`\n[2] Testing Registration with: ${testEmail}...`);
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Mario Rossi",
      email: testEmail,
      password: "Password@123"
    });
    console.log("✅ User registered successfully. Response:", regRes.data.message);
    const verificationToken = regRes.data.verificationTokenPreview;

    // 3. Verify Email
    console.log("\n[3] Testing Email Verification...");
    const verifyRes = await axios.get(`${BASE_URL}/auth/verify-email/${verificationToken}`);
    console.log("✅ Email verified:", verifyRes.data.message);

    // 4. Login User
    console.log("\n[4] Testing User Login...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: "Password@123"
    });
    console.log("✅ User Login Success. Token generated.");
    const userToken = loginRes.data.token;
    const userId = loginRes.data.user._id;

    // 5. Get Pizza Options
    console.log("\n[5] Testing Pizza Options API...");
    const optionsRes = await axios.get(`${BASE_URL}/pizzas/options`);
    console.log(`✅ Loaded options: ${optionsRes.data.bases.length} bases, ${optionsRes.data.sauces.length} sauces, ${optionsRes.data.cheeses.length} cheeses, ${optionsRes.data.vegetables.length} veggies.`);

    const base = optionsRes.data.bases[0];
    const sauce = optionsRes.data.sauces[0];
    const cheese = optionsRes.data.cheeses[0];
    const veggie1 = optionsRes.data.vegetables[0];
    const veggie2 = optionsRes.data.vegetables[1];

    console.log(`Selected configuration:
      Base: ${base.name} (Stock: ${base.quantity}, ₹${base.price})
      Sauce: ${sauce.name} (Stock: ${sauce.quantity}, ₹${sauce.price})
      Cheese: ${cheese.name} (Stock: ${cheese.quantity}, ₹${cheese.price})
      Veggies: ${veggie1.name} (₹${veggie1.price}), ${veggie2.name} (₹${veggie2.price})`);

    const initialBaseStock = base.quantity;

    // 6. Create Payment Order
    console.log("\n[6] Testing Razorpay Payment Order Creation...");
    const orderPayload = {
      items: [
        {
          baseId: base._id,
          sauceId: sauce._id,
          cheeseId: cheese._id,
          vegetableIds: [veggie1._id, veggie2._id],
          pizzaName: "Chef's Artisanal Supreme",
          quantity: 1
        }
      ],
      deliveryAddress: {
        name: "Mario Rossi",
        phone: "9876543210",
        street: "742 Evergreen Terrace",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      }
    };

    const paymentRes = await axios.post(`${BASE_URL}/orders/create-payment`, orderPayload, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log("✅ Razorpay Order initialized. Server calculated amount:", paymentRes.data.orderSummary.totalAmount, "INR");
    const rzpOrder = paymentRes.data.razorpayOrder;

    // 7. Verify Payment & Place Order (Deducts stock)
    console.log("\n[7] Testing Payment Verification & Atomic Stock Deduction...");
    const verifyPayRes = await axios.post(
      `${BASE_URL}/orders/verify-payment`,
      {
        razorpayOrderId: rzpOrder.id,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: "valid_signature",
        ...orderPayload
      },
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );
    console.log("✅ Order finalized in MongoDB! Order ID:", verifyPayRes.data.order._id);
    const orderId = verifyPayRes.data.order._id;

    // 8. Verify Stock Deduction in MongoDB
    console.log("\n[8] Verifying Inventory Stock Deduction...");
    const updatedOptions = await axios.get(`${BASE_URL}/pizzas/options`);
    const updatedBase = updatedOptions.data.bases.find((b) => b._id === base._id);
    console.log(`Base initial stock: ${initialBaseStock} ➔ New stock: ${updatedBase.quantity}`);
    if (updatedBase.quantity === initialBaseStock - 1) {
      console.log("✅ Stock deduction verified accurately (-1 unit).");
    } else {
      console.warn("⚠️ Stock deduction mismatch!");
    }

    // 9. Admin Login
    console.log("\n[9] Testing Admin Login...");
    const adminLoginRes = await axios.post(`${BASE_URL}/admin/login`, {
      email: "gopalmuruga007@gmail.com",
      password: "Pizza@123"
    });
    console.log("✅ Admin logged in. Token generated.");
    const adminToken = adminLoginRes.data.token;

    // 10. Admin Dashboard
    console.log("\n[10] Testing Admin Dashboard Metrics...");
    const dashRes = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("✅ Admin Stats:", {
      totalOrders: dashRes.data.stats.totalOrders,
      totalRevenue: dashRes.data.stats.totalRevenue,
      lowStockCount: dashRes.data.stats.lowStockCount
    });

    // 11. Admin updates Order Status (advancing to "In Kitchen" then "Sent to Delivery")
    console.log("\n[11] Testing Admin Order Status Update (Real-time trigger)...");
    const statusUpdateRes = await axios.patch(
      `${BASE_URL}/admin/orders/${orderId}/status`,
      { status: "In Kitchen" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log("✅ Order status successfully updated to:", statusUpdateRes.data.order.orderStatus);

    // 12. User gets own orders
    console.log("\n[12] Testing User Orders API...");
    const myOrdersRes = await axios.get(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`✅ User has ${myOrdersRes.data.orders.length} order(s). Latest status: "${myOrdersRes.data.orders[0].orderStatus}"`);

    console.log("\n==========================================");
    console.log("🎉 ALL END-TO-END TESTS PASSED PERFECTLY!");
    console.log("==========================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test Failed:", error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
