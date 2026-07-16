const express = require("express");
const router = express.Router();
const User = require("../models/users.models"); // Make sure your User model exists

router.get("/user", async (req, res) => {
  try {
    const user = await User.UserModel.findById(req.user.userId); // Fetch logged-in user
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// In chatRoutes.js
router.get("/user/groups", async (req, res) => {
  try {
    const groups = await GroupModel.find({ 
      $or: [
        { members: req.user.userId },
        { admins: req.user.userId }
      ]
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

module.exports = router;
