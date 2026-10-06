import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const list = getWatchlist(userId);
  res.status(200).json(list || []);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const movie = addMovie(userId, req.body);
  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;
  const updated = updateMovie(
    parseInt(userId, 10),
    parseInt(movieId, 10),
    req.body,
  );
  res.status(200).json(updated);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;
  deleteMovie(parseInt(userId, 10), parseInt(movieId, 10));
  res.status(200).send();
});

export default router;
