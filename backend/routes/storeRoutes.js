// server/routes/storeRoutes.js

import express from "express";
import { redeemItem } from "../controllers/storeController.js";
// import { redeemItem } from "../controllers/storeController.js";

const router = express.Router();
router.post("/redeem", redeemItem);
export default router;
