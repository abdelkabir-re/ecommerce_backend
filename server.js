const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const qs = require("qs");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewar");
const dbConnection = require("./config/database");

//routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");

// connect with database
dbConnection();

//express app
const app = express();
app.set("query parser", (str) => qs.parse(str));

//middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

//Mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

//Global error handling middleware for express(about routing and  middleware)
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App runing on Port ${PORT}`);
});

//handle rejection outside express (about database .....)
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors:${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down.....`);
    process.exit(1);
  });
});
