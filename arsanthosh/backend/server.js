const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/arsanthosh";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    })
    .catch((err) => console.log(err));

module.exports = app;
