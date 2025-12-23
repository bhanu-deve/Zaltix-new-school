import express from "express";
import upload from "../Middlewares/upload.js";
import {
  createEbook,
  getEbooks,
  getEbookById,
  updateEbook,
  deleteEbook
} from "../controllers/ebookController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  createEbook
);

router.get("/", getEbooks);
router.get("/:id", getEbookById);

router.put(
  "/:id",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateEbook
);

router.delete("/:id", deleteEbook);

export default router;
