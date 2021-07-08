const express = require("express");
const connectDB = require("./config/db");
const app = express();
// ----------------------- Connect DB ----------------
connectDB();

// ------------------ middle wares ------------------
app.use(express.json({ extended: false }));

// ----------------Routes Classification -------------
app.use("/api/auth", require("./routes/authenticationRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/ads", require("./routes/adsRoutes"));

// ------------------- Server Port Setup ---------------
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server is running up at port ${port}`);
});
