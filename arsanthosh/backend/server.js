require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/subscribers", require("./routes/subscriberRoutes"));

// Serve static files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Masked URI for logging
const maskedURI = MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error(
      "Check your IP Whitelist in Atlas (0.0.0.0/0 required for Render)"
    );
  });

// Listen on all network interfaces (required for Render/Cloud)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
