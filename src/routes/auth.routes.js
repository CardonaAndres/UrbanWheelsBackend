import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.get('/verifyToken',  authController.verifyToken);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout',  authController.logOut);

router.put('/changePassword', authController.chagePassword);

export default router;