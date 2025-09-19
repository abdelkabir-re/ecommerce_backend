const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const qs = require("qs");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewar");
const dbConnection = require("./config/database");

//routes
const mountRoutes=require('./routes')

// connect with database
dbConnection();

//express app
const app = express();
app.set("query parser", (str) => qs.parse(str));

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

//Mount routes
mountRoutes(app)

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
