// server.js
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const qs = require("qs");
const cors = require("cors");
const compression = require("compression");
const http = require("http");
const { Server } = require("socket.io");

// const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewar");
const dbConnection = require("./config/database");

//routes
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./services/orderService");

// connect with database
dbConnection();

//express app
const app = express();

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // only allow frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies or headers with tokens
  })
);

// compression
app.use(compression());

// query parser
app.set("query parser", (str) => qs.parse(str));

// webhook route
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// JSON body parser
app.use(express.json({ limit: "20kb" }));

// serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// sanitize input (optional)
// app.use(mongoSanitize());
// app.use(xss());

// rate limiter (optional)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 3,
//   message: "Too many requests from this IP, please try again later",
// });
// app.use("/api", limiter);

// Mount your API routes
mountRoutes(app);

// handle undefined routes
app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});

// Export io for services to use
module.exports = { app, io };

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
