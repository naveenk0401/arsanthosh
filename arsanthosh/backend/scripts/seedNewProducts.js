const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const products = [
  {
    name: "Premium Kitchen Roller Shutter (RTRS-101)",
    slug: "kitchen-roller-shutter-rtrs-101",
    description:
      "High-quality aluminum roller shutter for modern kitchen cabinets. Designed for smooth operation and space-saving efficiency.",
    features: [
      "Size: 600mm x 1320mm",
      "Smooth Rolling Mechanism",
      "Durable Aluminum Construction",
      "Minimalist Aesthetic",
    ],
    whyChoose: [
      "Optimizes kitchen space",
      "Easy to install and maintain",
      "Premium imported quality",
      "Adds a sleek, contemporary look to your cabinets",
    ],
    price: 10000,
    costPrice: 8500,
    category: "Kitchen Accessories",
    images: ["/products/roller-shutter.png"],
    stock: 50,
    status: "published",
    isFeatured: true,
  },
  {
    name: "Designer G Profile Handle SS-304",
    slug: "designer-g-profile-handle-ss-304",
    description:
      "Elegant G-profile handles crafted from high-grade Stainless Steel 304. Available in multiple luxury finishes to complement your cabinetry.",
    features: [
      "Material: SS-304",
      "Thickness: 0.5mm",
      "Finishes: Gold Mirror, Rose Gold Mirror, Silver Mirror, Black Hairline",
      "Sleek Profile",
    ],
    whyChoose: [
      "Corrosion-resistant material",
      "Ergonomic design for comfortable grip",
      "Luxury metallic reflections",
      "Perfect for high-end interior projects",
    ],
    price: 1500,
    costPrice: 1100,
    category: "Hardware",
    images: ["/products/g-profile-handle.png"],
    stock: 200,
    status: "published",
    isFeatured: true,
  },
  {
    name: "Smart Sensor Cabinet LED Light (PLED-002)",
    slug: "smart-sensor-cabinet-led-light-pled-002",
    description:
      "Intelligent infrared sensor LED light for cabinets and wardrobes. Automatically activates on movement and cuts off after use to save energy.",
    features: [
      "Infrared Motion Sensor",
      "Auto Cut-Off Filter",
      "3x AAA Batteries Included",
      "Durable PVC Casing",
    ],
    whyChoose: [
      "Wireless and easy to install",
      "Energy-efficient smart technology",
      "Ideal for dark cabinet spaces",
      "Reliable performance with auto-off feature",
    ],
    price: 600,
    costPrice: 400,
    category: "Lighting",
    images: ["/products/sensor-led-light.png"],
    stock: 500,
    status: "published",
    isFeatured: true,
  },
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not found");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const Product = mongoose.model(
      "Product",
      new mongoose.Schema(
        {
          name: String,
          slug: String,
          description: String,
          features: [String],
          whyChoose: [String],
          price: Number,
          costPrice: Number,
          category: String,
          images: [String],
          stock: Number,
          status: String,
          isFeatured: Boolean,
        },
        { collection: "ars_products" }
      )
    );

    console.log("Seeding products...");
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} products.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedProducts();
