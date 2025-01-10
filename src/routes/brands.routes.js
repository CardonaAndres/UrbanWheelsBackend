import express from "express";
import * as branController from "../controllers/brand.controller.js";

const router = express.Router();

router.get('/getBrands', branController.getBrands);
router.post('/createBrand', branController.createBrand);
router.put('/updateBrand/:id', branController.updateBrand);
router.delete('/deleteBrand/:id',branController.deleteBrand);

export default router;

