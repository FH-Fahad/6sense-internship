const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  isUser,
} = require("../Controllers/User.Controller");

// Create a user
router.post("/", createUser);

// Get all user
router.get("/", getAllUsers);

// Get a specific user
router.get("/:id", isUser, getUser);

// Delete a user
router.delete("/:id", isUser, deleteUser);

// Update a user
router.patch("/:id", isUser, updateUser);

module.exports = router;
