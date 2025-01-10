import express from "express";
import * as serviceController from '../controllers/service.controller.js'

const router = express.Router();

router.get('/services', serviceController.getServices);
router.get('/service/:id', serviceController.getService);
router.post('/service', serviceController.createService);
router.put('/service/:id', serviceController.updateService);
router.delete('/service/:id', serviceController.deleteService);

export default router;