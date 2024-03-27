const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const userController = require("./Routes/User.Routes");
const paginationController = require("./Routes/Pagination.Routes");
const DBConnection = require("./Models/DBConnection");

DBConnection();

app.use(express.json());
app.use("/", paginationController);
app.use("/", userController);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
