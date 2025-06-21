import express from "express";
import { printTest } from "../controllers/testControllers";

const router = express.Router();

router.get("/", printTest);

export default router;
