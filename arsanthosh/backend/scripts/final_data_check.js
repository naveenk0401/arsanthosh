const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function checkStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const collections = [
      "ars_products",
      "ars_projects",
      "ars_orders",
      "ars_inquiries",
      "ars_activities",
    ];
    const stats = {};

    for (const col of collections) {
      stats[col] = await mongoose.connection.db
        .collection(col)
        .countDocuments();
    }

    console.log("---DATA_CHECK_START---");
    console.log("Database:", mongoose.connection.name);
    console.log("Stats:", JSON.stringify(stats, null, 2));
    console.log("---DATA_CHECK_END---");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkStatus();
