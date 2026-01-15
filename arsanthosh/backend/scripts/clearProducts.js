const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const clearProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env file");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Define the schema/model
    const Product = mongoose.model(
      "Product",
      new mongoose.Schema({}, { strict: false, collection: "ars_products" })
    );

    console.log("Deleting all products from 'ars_products' collection...");
    const result = await Product.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} products.`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error.message);
    process.exit(1);
  }
};

clearProducts();
