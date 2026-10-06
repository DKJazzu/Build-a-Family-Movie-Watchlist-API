import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.sendStatus(400);
  }

  const user = findByUsername(username);
  if (!user) {
    return res.sendStatus(401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.sendStatus(401);
  }

  // issue time-limited access token for authenticated requests
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return res.status(200).json({ token });
});

export default router;
