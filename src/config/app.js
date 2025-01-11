import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import path from 'path';;
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.routes.js';
import carTypeRoutes from '../routes/carType.routes.js';
import brandRoutes from '../routes/brands.routes.js';
import carRoutes from '../routes/car.routes.js';
import typeDocRouter from '../routes/typeDocs.routes.js';
import statesRoutes from '../routes/states.routes.js';
import servicesRoutes from '../routes/services.routes.js'
import carServiceRouter from '../routes/carService.routes.js'
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { CLIENT_ORIGIN } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(cors({ 
    origin: CLIENT_ORIGIN, 
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

app.use(morgan('dev'));

app.use('/API/auth', authRoutes);
app.use('/API/docs', typeDocRouter);

app.use('/API/users', authMiddleware, userRoutes);
app.use('/API/carTypes', authMiddleware, carTypeRoutes);
app.use('/API/brands', authMiddleware, brandRoutes);
app.use('/API/states', authMiddleware, statesRoutes);
app.use('/API/cars', authMiddleware, carRoutes);
app.use('/API/services', authMiddleware, servicesRoutes);
app.use('/API/carServices', authMiddleware, carServiceRouter);


export default app;
