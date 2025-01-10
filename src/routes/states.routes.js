import express from "express";
import * as stateController from '../controllers/states.controller.js'

const router = express.Router();

router.get('/states', stateController.getStates);
router.get('/state/:id', stateController.getStateById);
router.post('/state', stateController.createState);
router.put('/state/:id', stateController.updatedState);
router.delete('/state/:id', stateController.deleteState);

export default router;