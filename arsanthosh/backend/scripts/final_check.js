const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const AdminSchema = new mongoose.Schema(
  {
    email: String,
    secretKey: String,
  },
  { collection: "ars_admins", strict: false }
);

const Admin = mongoose.model("Admin", AdminSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await Admin.findOne({ email: "kumarspnaveen7@gmail.com" });
    const productCount = await mongoose.connection.db
      .collection("ars_products")
      .countDocuments();

    console.log("---CHECK_SUCCESS---");
    console.log("Database:", mongoose.connection.name);
    console.log("ProductCount:", productCount);
    if (admin) {
      console.log("SecretKey:", admin.secretKey);
    } else {
      console.log("Admin: NOT_FOUND");
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
