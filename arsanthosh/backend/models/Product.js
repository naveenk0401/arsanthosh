const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    features: [{ type: String }], // Array of key features
    whyChoose: [{ type: String }], // "Why choose this product" bullets
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0 }, // For profit calculation
    category: { type: String, required: true },
    images: [{ type: String }], // Array of Image URLs
    videos: [{ type: String }], // Array of Video URLs
    stock: { type: Number, default: 0 },
    returnedCount: { type: Number, default: 0 },
    damagedCount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "ars_products" }
);

// Index for better search performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ createdAt: -1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model("Product", productSchema);
