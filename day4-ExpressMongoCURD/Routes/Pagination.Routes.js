const express = require("express");
const router = express.Router();

const {
  queryPagination,
  routePagination,
} = require("../Controllers/Pagination.Controller");

// Pagination with query parameter
router.get("/page", queryPagination);

// Pagination with routes parameter
router.get("/page/:id", routePagination);

module.exports = router;
