import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';
import * as carModel from "../models/car.model.js"; 
import { hasPermission } from "../middlewares/authMiddleware.js";
import { SERVER_ORIGIN } from "../config/config.js";
import { getUserById } from "../models/auth.model.js";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

export const getCars = async (req, res) => {

    try {

        const { page = 1 } = req.query; 
        const offset = (page - 1) * 15;   
        const totalCars = await carModel.totalCars();
        const cars = await carModel.getCars(offset);
        const totalPages = Math.ceil(totalCars / 15);

        return res.status(200).json({
            cars,
            pagination: {
                currentPage: parseInt(page),   
                totalPages: totalPages,        
                totalCars: totalCars,          
            },
            message: "Tarea exitosa"
        });

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const getCar = async (req, res) =>{

    try {

        const car = await carModel.getCar(req.params.id);

        if(!car) return res.status(404).json({ message : 'Vehiculo no encontrado' });

        return res.status(200).json(car);

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const getCarByPlate = async (req, res) => {
    try {
         
        const car = await carModel.getCarByPlate(req.params.plate);
        
        if(!car) return res.status(404).json({ message : 'Vehiculo no encontrado' });

        return res.status(200).json(car);

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }
}

export const createCar = async (req, res) => {

    try {
        
        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
        
       const {model, year, plate, kilometre, color, acquisition_date, 
            status_ID, brand_ID, car_type_ID} = req.body

        if (!req.file) return res.status(400).json({ message : "Por favor, subir la imagen" });
        
        const checkPlate = await carModel.checkPlate(plate);

        if(!/^\d{4}$/.test(year)){
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ message: "El año debe ser un número de 4 dígitos" });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(acquisition_date)) {
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ 
                message: "La fecha de adquisición debe tener el formato YYYY-MM-DD" });
        }
        
        const acquisitionDate = new Date(acquisition_date);

        if (acquisitionDate > new Date()) {
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ message: "La fecha de adquisición no puede ser en el futuro" });
        }

        if (!Number.isInteger(parseInt(kilometre)) || kilometre < 0) {
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ message: "El kilometraje debe ser un número positivo" });
        }

        if(checkPlate) {
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            return res.status(400).json({ message : 'Placa registrada' });
        }
        
        const imageUrl = `${SERVER_ORIGIN}/uploads/${req.file.filename}`;

        await carModel.createCar({ 
            image_url : imageUrl, model, year, plate, kilometre, color, acquisition_date, status_ID, 
            brand_ID, car_type_ID });
            
        return res.status(201).json({ message : 'Carro creado con exito' });
    
    } catch (err) {

        if (req.file) 
            await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
        
        return res.status(500).json({ message: err.message});
    }

}

export const updateCar = async (req, res) => {
    try {

        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [1]); 

        if (!hasPerm.permission) return res.status(403).json({ message: hasPerm.message });

        const idCar = req.params.id; 
        const car = await carModel.getCar(idCar);

        if (!car) return res.status(404).json({ message: "Carro no encontrado" });

        const { model, year, plate, kilometre, color, acquisition_date, 
                status_ID, brand_ID, car_type_ID } = req.body;

        if (!/^\d{4}$/.test(year)) 
            return res.status(400).json({ message: "El año debe ser un número de 4 dígitos" });

        if (!Number.isInteger(parseInt(kilometre)) || kilometre < 0) 
            return res.status(400).json({ message: "El kilometraje debe ser un número positivo" });

        const acquisitionDate = new Date(acquisition_date);

        if (acquisitionDate > new Date()) 
            return res.status(400).json({ 
                message: "La fecha de adquisición no puede ser en el futuro" });

        const updatedData = {
            model, year, plate, kilometre, color, acquisition_date, status_ID, brand_ID, car_type_ID };


        if (req.file) {
            const newImageUrl = `${SERVER_ORIGIN}/uploads/${req.file.filename}`;
            updatedData.image_url = newImageUrl;

            const oldImagePath = car.image_url 
                ? path.join(__dirname, '..', 'uploads', car.image_url.split('/').pop()) 
                : null;

            if (oldImagePath) {
                try {
                    await fs.access(oldImagePath); 
                    await fs.unlink(oldImagePath); 
                } catch (err) {
                    console.error("No se pudo eliminar la imagen anterior:", err.message);
                }
            }
            
        } else {
            updatedData.image_url = car.image_url; 
        }


        await carModel.updateCar(idCar, updatedData);

        return res.status(200).json({ message: "Carro actualizado con éxito" });

    } catch (err) {

        if (req.file) {
            try {
                await fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
            } catch (unlinkErr) {
                console.error("Error al eliminar la imagen tras fallo:", unlinkErr.message);
            }
        }

        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


export const deleteCar = async (req, res) => {

    try {
        
        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [1]);

        if (!hasPerm.permission) 
            return res.status(403).json({ message: hasPerm.message });
        
        const id = req.params.id;
        const car = await carModel.getCar(id);

        if (!car) return res.status(404).json({ message: 'Carro no encontrado' });

        if (!car.image_url) 
            return res.status(400).json({ message: 'El carro no tiene una imagen asociada' });

        const imageUrl = car.image_url;

        if (imageUrl) {

            const fileName = imageUrl.split('/').pop();
            const imagePath = path.join(__dirname, '..', 'uploads', fileName);

            try {
                await fs.access(imagePath);
                await fs.unlink(imagePath);
            } catch (err) {
                console.error('Error al acceder o eliminar la imagen:', err.message);
                return res.status(500).json({ message: 'Error al eliminar la imagen' });
            }
            
        }

        await carModel.deleteCar(id);

        return res.status(200).json({ message: 'Carro eliminado con éxito', car });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

