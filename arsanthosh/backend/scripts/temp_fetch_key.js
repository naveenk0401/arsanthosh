const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGO_URI;

const AdminSchema = new mongoose.Schema(
  {
    email: String,
    secretKey: String,
  },
  { collection: "ars_admins" }
);

const Admin = mongoose.model("Admin", AdminSchema);

async function fetchKey() {
  try {
    await mongoose.connect(MONGO_URI);
    const admin = await Admin.findOne({ email: "kumarspnaveen7@gmail.com" });
    if (admin) {
      console.log("---RESULT_START---");
      console.log("Email:", admin.email);
      console.log("SecretKey:", admin.secretKey);
      console.log("---RESULT_END---");
    } else {
      console.log("Admin not found in ars_admins");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

fetchKey();
