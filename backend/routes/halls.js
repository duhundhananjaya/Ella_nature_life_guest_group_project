import express from "express";
import {
  addHall,
  upload,
  updateHall,
  getHall,
  getHallById,
  deleteHall,
} from "../controllers/hallController.js";

const router = express.Router();

router.get("/", getHall);
router.get("/:id", getHallById);

router.post("/add", upload.array("images", 5), addHall);
router.put("/update/:id", upload.array("images", 5), updateHall);
router.delete("/delete/:id", deleteHall);

export default router;
