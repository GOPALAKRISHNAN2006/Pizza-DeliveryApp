/**
 * Formats amount into Indian Rupee currency format (₹)
 * @param {number} amount
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Formats ISO date string into readable format
 * @param {string|Date} dateStr
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

/**
 * Returns badge css class for order status
 */
export const getOrderStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return "badge badge-success";
    case "Sent to Delivery":
      return "badge badge-info";
    case "In Kitchen":
      return "badge badge-warning";
    case "Order Received":
      return "badge badge-primary";
    case "Cancelled":
      return "badge badge-danger";
    default:
      return "badge badge-info";
  }
};

/**
 * Order status progress steps
 */
export const ORDER_STEPS = [
  { key: "Order Received", label: "Order Received", icon: "Clock", desc: "We got your order and preparing ingredients" },
  { key: "In Kitchen", label: "In Kitchen", icon: "Flame", desc: "Baking in our hot stone oven" },
  { key: "Sent to Delivery", label: "Sent to Delivery", icon: "Bike", desc: "On the road to your doorstep" },
  { key: "Delivered", label: "Delivered", icon: "CheckCircle2", desc: "Enjoy your hot, fresh pizza!" }
];

export const getOrderStatusStepIndex = (status) => {
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return idx !== -1 ? idx : 0;
};
