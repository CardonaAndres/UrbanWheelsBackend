import express from "express";
import upload from "../config/multer.js";
import * as carController from "../controllers/car.controller.js";

const router = express.Router();

router.get('/cars', carController.getCars);
router.get('/car/:id', carController.getCar);
router.get('/carByPlate/:plate', carController.getCarByPlate)
router.post('/car', upload.single('image_url'), carController.createCar);
router.put('/car/:id', upload.single('image_url'), carController.updateCar);
router.delete('/car/:id', carController.deleteCar);

export default router;