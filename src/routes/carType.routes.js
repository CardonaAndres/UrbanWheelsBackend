import express from "express";
import * as carTypeController from "../controllers/carType.controller.js"

const router = express.Router();

router.get('/getCarTypes', carTypeController.getCarTypes);
router.post('/createCarType', carTypeController.createTypeCar);
router.put('/updateTypeCar', carTypeController.updateTypeCar);
router.delete('/deleteTypeCar/:id', carTypeController.deleteTypeCar);

export default router