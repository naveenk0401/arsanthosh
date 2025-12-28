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

    console.log("---CHECK_START---");
    console.log("DB Name:", mongoose.connection.name);
    console.log("Product Count:", productCount);
    if (admin) {
      console.log("Secret Key:", admin.secretKey);
    } else {
      console.log("Admin NOT FOUND");
    }
    console.log("---CHECK_END---");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
