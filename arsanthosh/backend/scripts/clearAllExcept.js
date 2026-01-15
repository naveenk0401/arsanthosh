const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const clearAllExcept = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env file");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      if (
        collectionName === "ars_products" ||
        collectionName === "ars_settings"
      ) {
        console.log(`Skipping collection: ${collectionName} (Preserving data)`);
        continue;
      }

      const Model = mongoose.model(
        collectionName,
        new mongoose.Schema({}, { strict: false, collection: collectionName })
      );

      if (collectionName === "ars_admins" || collectionName === "ars_users") {
        console.log(
          `Clearing collection: ${collectionName} EXCEPT super-admins...`
        );
        const result = await Model.deleteMany({ role: { $ne: "super-admin" } });
        console.log(
          `Deleted ${result.deletedCount} non-super-admin records from ${collectionName}.`
        );
      } else {
        console.log(`Clearing all data from collection: ${collectionName}...`);
        const result = await Model.deleteMany({});
        console.log(
          `Deleted ${result.deletedCount} records from ${collectionName}.`
        );
      }

      // Delete the model from mongoose to avoid overwriting error if run multiple times in same process (though here the process exits)
      delete mongoose.models[collectionName];
    }

    console.log("\nDatabase cleanup complete.");
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error.message);
    process.exit(1);
  }
};

clearAllExcept();
