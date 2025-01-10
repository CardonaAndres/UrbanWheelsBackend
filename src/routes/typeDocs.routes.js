import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as typeDocController from "../controllers/typeDoc.controller.js";
const router = Router();

router.get('/typeDocs', typeDocController.getTypeDocs);
router.get('/typeDoc/:id', authMiddleware, typeDocController.getTypeDocById);
router.post('/typeDoc', authMiddleware, typeDocController.createTypeDoc);
router.put('/typeDoc/:id', authMiddleware, typeDocController.updateTypeDoc);
router.delete('/typeDoc/:id', authMiddleware, typeDocController.deleteTypeDoc);

export default router;