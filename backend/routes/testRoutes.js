import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  createTest,
  getTests,
  getTestById,
   getTestByOffre,
  updateTest,
  deleteTest
} from "../controllers/testController.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, isAdmin, createTest);

// READ by offreId
router.get("/by-offre/:offreId", getTestByOffre);

// READ all
router.get("/", getTests);

// READ one
router.get("/:id", getTestById);

// UPDATE
router.put("/:id", verifyToken, isAdmin, updateTest);

// DELETE
router.delete("/:id", verifyToken, isAdmin, deleteTest);

export default router;
