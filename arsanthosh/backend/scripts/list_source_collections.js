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
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("---COLLECTIONS_START---");
    console.log(collections.map((c) => c.name).join(", "));
    console.log("---COLLECTIONS_END---");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
