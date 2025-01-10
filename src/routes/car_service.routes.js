import express from "express";
import * as carServicesController from '../controllers/car_service.controller.js';

const router = express.Router();

router.get('/car_services/:id', carServicesController.getCarServices);
router.post('/car_service', carServicesController.createCarService);
router.put('/car_service/:id', carServicesController.updatedCarService);
router.delete('/car_service/:id', carServicesController.deleteCarService);

export default router;