import AddStock from "../models/AddStock.js";

// CREATE stock item
export const createStock = async (req, res) => {
  try {
    const { item, category, quantity, minStock, status, vendor } = req.body;

    if (!item || !category || !quantity || !minStock || !status || !vendor) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newStock = new AddStock({
      item,
      category,
      quantity,
      minStock,
      status,
      vendor
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all stock items
export const getAllStock = async (req, res) => {
  try {
    const items = await AddStock.find().exec();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE stock item
export const updateStock = async (req, res) => {
  try {
    const updated = await AddStock.findByIdAndUpdate(
      req.params.id,
      {
        item: req.body.item,
        category: req.body.category,
        quantity: req.body.quantity,
        minStock: req.body.minStock,
        status: req.body.status,
        vendor: req.body.vendor
      },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE stock item
export const deleteStock = async (req, res) => {
  try {
    const deleted = await AddStock.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully', item: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
