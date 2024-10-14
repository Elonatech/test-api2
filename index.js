const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const adminRoutes = require("./routes/adminRoute");
const blogRoutes = require("./routes/blogRoute");
const newsRoute = require("./routes/newsRoute")
const visitorRoutes =require("./routes/visitorRoutes")
const logVisitor = require("./middleware/visitorMiddleware");
const productRoutes = require("./routes/productRoute");
const emailRoutes = require("./routes/emailRoute");
const { connectMongodb } = require("./config/database");
const pingServer = require("./keepAlive");
const RecentlyViewed = require("./models/recentlyViewesModel")




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

// Visitor Tracking Middleware
app.use(logVisitor);


// ROUTES
app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING");
});

//recent-products routes

// app.get("/api/v1/product/products/recently-viewed", async (req, res) => {
//   try {
//     const recentlyViewed = await RecentlyViewed.findOne().populate("products");

//     if (!recentlyViewed) {
//       return res.status(200).json({ recentlyViewedProducts: [] });
//     }

//     res.status(200).json({
//       success: true,
//       recentlyViewedProducts: recentlyViewed.products
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


app.get("/api/v1/product/products", productRoutes)
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);


// PORT
app.listen(PORT, () => {
  console.log(`PORT STARTED AT ${PORT}`);
});


pingServer()