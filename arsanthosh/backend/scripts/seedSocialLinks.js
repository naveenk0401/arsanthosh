const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const seedSettings = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not found");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const Settings = require("../models/Settings");

    const socialLinks = {
      instagramUrl:
        "https://www.instagram.com/p/DTh_4E-Elk-/?igsh=MXVobWJ1aGI0Mnoweg==",
      youtubeUrl: "https://youtube.com/@thisisarsanthosh?si=qSSHwsILVOHyADU4",
    };

    console.log("Seeding social links...");
    await Settings.findOneAndUpdate(
      { key: "social_links" },
      { value: socialLinks },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("Successfully seeded social links.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedSettings();
