import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAdminInventory,
  addAdminInventory,
  updateAdminInventory,
  patchAdminInventory,
  deleteAdminInventory
} from "../../services/adminService";
import { useToast } from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatters";
import { TableRowSkeleton } from "../../components/SkeletonLoader";
import OptimizedImage from "../../components/OptimizedImage";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw
} from "lucide-react";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "base",
    quantity: 30,
    lowStockThreshold: 10,
    price: 50,
    description: "",
    imageUrl: ""
  });

  const toast = useToast();

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminInventory();
      if (res.success) {
        setInventory(res.inventory || []);
      }
    } catch (err) {
      console.error("Inventory fetch failed:", err);
      toast.error(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Compute filtered items derived from state
  const filtered = useMemo(() => {
    let result = [...inventory];

    if (categoryFilter !== "All") {
      result = result.filter((i) => i.category === categoryFilter.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return result;
  }, [categoryFilter, searchQuery, inventory]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Item Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addAdminInventory(formData);
      if (res.success) {
        toast.success("Ingredient added successfully! 🍕");
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          category: "base",
          quantity: 30,
          lowStockThreshold: 10,
          price: 50,
          description: "",
          imageUrl: ""
        });
        fetchInventory();
      }
    } catch (err) {
      console.error("Add item error:", err);
      toast.error(err.message || "Failed to add ingredient");
    }
  };

  // Edit Item Open
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold,
      price: item.price,
      description: item.description || "",
      imageUrl: item.imageUrl || ""
    });
    setIsEditModalOpen(true);
  };

  // Edit Item Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await updateAdminInventory(editingItem._id, formData);
      if (res.success) {
        toast.success("Ingredient updated successfully!");
        setIsEditModalOpen(false);
        setEditingItem(null);
        fetchInventory();
      }
    } catch (err) {
      console.error("Update item error:", err);
      toast.error(err.message || "Failed to update ingredient");
    }
  };

  // Quick Quantity Patch (+5 or -1)
  const handleQuickAdjust = async (item, delta) => {
    const newQty = Math.max(0, item.quantity + delta);
    try {
      const res = await patchAdminInventory(item._id, { quantity: newQty });
      if (res.success) {
        toast.success(`Updated "${item.name}" stock to ${newQty}`);
        setInventory((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, quantity: newQty } : i))
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to adjust stock");
    }
  };

  // Delete Item
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}" from inventory?`)) {
      return;
    }

    try {
      const res = await deleteAdminInventory(item._id);
      if (res.success) {
        toast.success("Item removed from inventory");
        fetchInventory();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete item");
    }
  };

  // Inventory summary metrics
  const totalCount = inventory.length;
  const lowStockCount = inventory.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length;
  const outOfStockCount = inventory.filter((i) => i.quantity === 0).length;
  const totalValue = inventory.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Inventory Management</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Control stock levels, thresholds, pricing, and ingredients for the Pizza Builder
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchInventory} className="btn-secondary" style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #f59e0b, #d97706)"
            }}
          >
            <Plus size={16} />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Inventory Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Total Items</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginTop: "4px" }}>{totalCount}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#fbbf24", fontWeight: 600 }}>Low Stock Alert</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fbbf24", marginTop: "4px" }}>{lowStockCount}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#f87171", fontWeight: 600 }}>Out of Stock</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f87171", marginTop: "4px" }}>{outOfStockCount}</div>
        </div>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 600 }}>Total Stock Value</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#34d399", marginTop: "4px" }}>{formatCurrency(totalValue)}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {["All", "Base", "Sauce", "Cheese", "Vegetable"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: categoryFilter === cat ? "#f59e0b" : "rgba(255,255,255,0.05)",
                color: categoryFilter === cat ? "#000" : "#cbd5e1",
                transition: "all 0.15s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search ingredient by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.5rem", padding: "0.5rem 1rem 0.5rem 2.5rem", fontSize: "0.875rem" }}
          />
          <Search size={16} color="#64748b" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
              <th style={{ padding: "12px 16px" }}>Ingredient Name</th>
              <th style={{ padding: "12px 16px" }}>Category</th>
              <th style={{ padding: "12px 16px" }}>Price (₹)</th>
              <th style={{ padding: "12px 16px" }}>Current Stock</th>
              <th style={{ padding: "12px 16px" }}>Low Stock Alert Threshold</th>
              <th style={{ padding: "12px 16px" }}>Quick Adjust</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableRowSkeleton cols={7} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                  No ingredients found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isOutOfStock = item.quantity === 0;
                const isLowStock = item.quantity > 0 && item.quantity <= item.lowStockThreshold;

                return (
                  <tr key={item._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                          <OptimizedImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={36}
                            height={36}
                            fallbackEmoji={item.category === "base" ? "🌾" : item.category === "sauce" ? "🍅" : item.category === "cheese" ? "🧀" : "🥗"}
                            containerStyle={{ width: "36px", height: "36px", borderRadius: "8px" }}
                            style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#fff" }}>{item.name}</div>
                          {item.description && (
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <span
                        className="badge"
                        style={{
                          background:
                            item.category === "base"
                              ? "rgba(245, 158, 11, 0.15)"
                              : item.category === "sauce"
                              ? "rgba(239, 68, 68, 0.15)"
                              : item.category === "cheese"
                              ? "rgba(251, 191, 36, 0.15)"
                              : "rgba(16, 185, 129, 0.15)",
                          color:
                            item.category === "base"
                              ? "#fbbf24"
                              : item.category === "sauce"
                              ? "#f87171"
                              : item.category === "cheese"
                              ? "#fde047"
                              : "#34d399",
                          textTransform: "capitalize"
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td style={{ padding: "12px 16px", fontWeight: 800, color: "#fff" }}>
                      {formatCurrency(item.price)}
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 800, color: isOutOfStock ? "#ef4444" : isLowStock ? "#f59e0b" : "#10b981" }}>
                          {item.quantity} units
                        </span>
                        {isOutOfStock ? (
                          <span className="badge badge-danger">Out</span>
                        ) : isLowStock ? (
                          <span className="badge badge-warning">Low</span>
                        ) : null}
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>
                      {item.lowStockThreshold} units
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          onClick={() => handleQuickAdjust(item, -1)}
                          disabled={item.quantity <= 0}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 700
                          }}
                          title="Decrease stock by 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item, 5)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            color: "#34d399",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 700
                          }}
                          title="Restock +5 units"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{
                            padding: "6px",
                            borderRadius: "6px",
                            background: "rgba(56, 189, 248, 0.1)",
                            border: "1px solid rgba(56, 189, 248, 0.3)",
                            color: "#38bdf8",
                            cursor: "pointer"
                          }}
                          title="Edit ingredient"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          style={{
                            padding: "6px",
                            borderRadius: "6px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            cursor: "pointer"
                          }}
                          title="Delete ingredient"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Add New Ingredient</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Ingredient Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Buffalo Mozzarella"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleFormChange} required>
                    <option value="base">Base (Crust)</option>
                    <option value="sauce">Sauce</option>
                    <option value="cheese">Cheese</option>
                    <option value="vegetable">Vegetable</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    min="0"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Initial Stock Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    min="0"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    className="form-input"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows="2"
                  placeholder="Brief description for customer builder..."
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.75rem 1.75rem", background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Edit Ingredient: {editingItem.name}</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Ingredient Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleFormChange} required>
                    <option value="base">Base (Crust)</option>
                    <option value="sauce">Sauce</option>
                    <option value="cheese">Cheese</option>
                    <option value="vegetable">Vegetable</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    min="0"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-input"
                    min="0"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    className="form-input"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows="2"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.75rem 1.75rem", background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  Update Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
