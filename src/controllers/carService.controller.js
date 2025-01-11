import * as carServiceModel from '../models/carService.model.js';
import { hasPermission } from "../middlewares/authMiddleware.js";
import { getUserById } from "../models/auth.model.js";
import { getCar } from '../models/car.model.js';

export const getCarServices = async (req, res) => {

    try {
        if (!req.params.id || isNaN(req.params.id)) 
            return res.status(400).json({ message: "Invalid or missing car ID" });
        
        const car = await getCar(req.params.id);

        if (!car) return res.status(404).json({ message: "No encontrado" });
        
        const car_services = await carServiceModel.getCarServices(car.car_ID);
        return res.status(200).json({
            car: {
                ...car,
                services: car_services
            }
        });
       
    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const createCarService = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { car_ID, service_ID, price } = req.body;

        if (!car_ID || !service_ID || !price || isNaN(price)) 
            return res.status(400).json({ message: "Invalid input data" });
        
        const carExists  = await getCar(car_ID);

        if (!carExists) return res.status(404).json({ message: "Car not found" });
        
        await carServiceModel.createCarService({ car_ID, service_ID, price });
        return res.status(201).json({ message : 'Creado con exito' })

    } catch (err) {
        return res.status(500).json({ message : err.message })
    }

}

export const updatedCarService = async (req, res) => {
    try {
        const car_service_ID = req.params.id;
        if (!car_service_ID  || isNaN(car_service_ID )) 
            return res.status(400).json({ message: "Invalid or missing car ID" });
  
        const { car_ID, service_ID, price } = req.body;
        if (!car_ID || !service_ID || !price || isNaN(price)) 
            return res.status(400).json({ message: "Invalid input data" });

        const car = await getCar(car_ID);
        if (!car) return res.status(404).json({ message: "No encontrado" });

        await carServiceModel.updatedCarService({car_service_ID, car_ID, service_ID, price});
        return res.status(200).json({ message : "Actualizado con exito" });

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }
}

export const deleteCarService = async (req, res) => {
    try {
        const car_service_ID = req.params.id;
        if (!car_service_ID  || isNaN(car_service_ID )) 
            return res.status(400).json({ message: "Invalid or missing car ID" });

        await carServiceModel.deleteCarService(car_service_ID);
        return res.status(200).json({ message : "Eliminado con exito" });

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }
}