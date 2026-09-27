import Inventory from "../model/Inventory.js";

/**
 * Add a new inventory ingredient
 * POST /api/admin/inventory
 */
export const addInventory = async (req, res, next) => {
  try {
    const { name, category, quantity, lowStockThreshold, price, description, imageUrl } = req.body;

    if (!name || !category || quantity === undefined || lowStockThreshold === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category, quantity, lowStockThreshold, and price are required."
      });
    }

    const validCategories = ["base", "sauce", "cheese", "vegetable"];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`
      });
    }

    const numQuantity = Number(quantity);
    const numThreshold = Number(lowStockThreshold);
    const numPrice = Number(price);

    if (numQuantity < 0 || numThreshold < 0 || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity, threshold, and price must be non-negative numbers."
      });
    }

    const inventory = await Inventory.create({
      name: name.trim(),
      category: category.toLowerCase().trim(),
      quantity: numQuantity,
      lowStockThreshold: numThreshold,
      price: numPrice,
      description: description ? description.trim() : "",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      lowStockAlertSent: numQuantity <= numThreshold
    });

    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully.",
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all inventory ingredients
 * GET /api/admin/inventory
 */
export const getInventory = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && ["base", "sauce", "cheese", "vegetable"].includes(category)) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const inventory = await Inventory.find(query).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get inventory item by ID
 * GET /api/admin/inventory/:id
 */
export const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found."
      });
    }

    return res.status(200).json({
      success: true,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventory item
 * PUT /api/admin/inventory/:id
 */
export const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, lowStockThreshold, price, description, imageUrl } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found."
      });
    }

    if (name) inventory.name = name.trim();
    if (category) {
      if (!["base", "sauce", "cheese", "vegetable"].includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category."
        });
      }
      inventory.category = category;
    }

    if (quantity !== undefined) {
      const q = Number(quantity);
      if (q < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot be negative."
        });
      }
      inventory.quantity = q;
      // If replenished above threshold, reset alert flag
      if (q > (inventory.lowStockThreshold || 0)) {
        inventory.lowStockAlertSent = false;
      }
    }

    if (lowStockThreshold !== undefined) {
      const t = Number(lowStockThreshold);
      if (t < 0) {
        return res.status(400).json({
          success: false,
          message: "Threshold cannot be negative."
        });
      }
      inventory.lowStockThreshold = t;
    }

    if (price !== undefined) {
      const p = Number(price);
      if (p < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative."
        });
      }
      inventory.price = p;
    }

    if (description !== undefined) inventory.description = description.trim();
    if (imageUrl !== undefined) inventory.imageUrl = imageUrl.trim();

    const updated = await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully.",
      updatedInventory: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Patch inventory item (e.g. quick stock adjustment)
 * PATCH /api/admin/inventory/:id
 */
export const patchInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found."
      });
    }

    if (updates.quantity !== undefined) {
      const q = Number(updates.quantity);
      if (isNaN(q) || q < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a non-negative number."
        });
      }
      inventory.quantity = q;
      if (q > inventory.lowStockThreshold) {
        inventory.lowStockAlertSent = false;
      }
    }

    if (updates.lowStockThreshold !== undefined) {
      const t = Number(updates.lowStockThreshold);
      if (isNaN(t) || t < 0) {
        return res.status(400).json({
          success: false,
          message: "Threshold must be a non-negative number."
        });
      }
      inventory.lowStockThreshold = t;
    }

    if (updates.price !== undefined) {
      const p = Number(updates.price);
      if (isNaN(p) || p < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number."
        });
      }
      inventory.price = p;
    }

    if (updates.name !== undefined) inventory.name = updates.name.trim();
    if (updates.category !== undefined) {
      if (["base", "sauce", "cheese", "vegetable"].includes(updates.category)) {
        inventory.category = updates.category;
      }
    }
    if (updates.description !== undefined) inventory.description = updates.description.trim();
    if (updates.imageUrl !== undefined) inventory.imageUrl = updates.imageUrl.trim();

    const saved = await inventory.save();

    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully.",
      updatedInventory: saved
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete inventory item
 * DELETE /api/admin/inventory/:id
 */
export const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found."
      });
    }

    await Inventory.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  patchInventory,
  deleteInventory
};