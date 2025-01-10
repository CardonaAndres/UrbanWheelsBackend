import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get('/user', userController.getUser);
router.get('/users', userController.getAllUsers);
router.get('/getRoles', userController.getRoles);
router.get('/usersByRol', userController.getUsersByRol);
router.post('/getUserByEmail', userController.getUserByEmail);
router.put('/updatedUser', userController.updatedUser);
router.delete('/deleteUser/:id', userController.deleteUser);

export default router;