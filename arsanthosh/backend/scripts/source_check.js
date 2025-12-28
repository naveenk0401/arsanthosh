const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const SOURCE_DB_URI = process.env.MONGO_URI.replace(
  "arsanthosh_db",
  "arsanthosh"
);

async function run() {
  try {
    await mongoose.connect(SOURCE_DB_URI);
    const Admin = mongoose.model(
      "Admin",
      new mongoose.Schema(
        { email: String, secretKey: String },
        { collection: "ars_admins" }
      )
    );
    const admin = await Admin.findOne({ email: "kumarspnaveen7@gmail.com" });
    const prodCount = await mongoose.connection.db
      .collection("ars_products")
      .countDocuments();

    console.log("---SOURCE_CHECK---");
    console.log("Database:", mongoose.connection.name);
    console.log("ProductCount:", prodCount);
    if (admin) {
      console.log("SecretKey:", admin.secretKey);
    }
    console.log("---END---");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
