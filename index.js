const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const adminRoutes = require("./routes/adminRoute");
const blogRoutes = require("./routes/blogRoute");
const newsRoute = require("./routes/newsRoute")
const productRoutes = require("./routes/productRoute");
const emailRoutes = require("./routes/emailRoute");
const { connectMongodb } = require("./config/database");


// JSON
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: "true" }));

// CORS
app.use(
  cors({
    origin: "*",
    credentials: "",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
  })
);

// DATABASE
connectMongodb();


// ROUTES
app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING");
});

app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/email", emailRoutes);


// PORT
app.listen(PORT, () => {
  console.log(`PORT STARTED AT ${PORT}`);
});
