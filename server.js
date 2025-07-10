const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const dbConnection=require('./config/database')
const categoryRoute=require('./routes/categoryRoute')

// connect with database
dbConnection()

//express app
const app = express();

//middleware
app.use(express.json())


if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

//routes
app.use('/api/v1/categories',categoryRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App runing on Port ${PORT}`);
});
