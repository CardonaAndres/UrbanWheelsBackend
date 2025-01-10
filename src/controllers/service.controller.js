import * as serviceModel from '../models/service.model.js';
import { getUserById } from "../models/auth.model.js";
import { hasPermission } from "../middlewares/authMiddleware.js";

export const getServices = async (req, res) => {

    try {

        const services = await serviceModel.getServices();
        return res.status(200).json(services);

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const getService = async (req, res) => {

    try {

        const service = await serviceModel.getServiceByID(req.params.id);
        return res.status(200).json(service);

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }

}

export const createService = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);  
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
    
        const { service_name, description, price_type } = req.body;
        await serviceModel.createService({ service_name, description, price_type });
        return res.status(201).json({ message : 'Servicio creado con exito' });

    } catch(err) {
        return res.status(500).json({ message : err.message });
    }

}

export const updateService = async (req, res) => {
    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);  
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const service_ID = req.params.id;
        const { service_name, description, price_type } = req.body;
        await serviceModel.updateService({ service_ID, service_name, description, price_type })
        return res.status(200).json({ message : 'Servicio actualizado con exito' });

    } catch(err) {
        return res.status(500).json({ message : err.message });
    }
}

export const deleteService = async (req, res) => {

    try {

        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);  
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        await serviceModel.deleteService(req.params.id);
        return res.status(200).json('Eliminado con exito');

    } catch(err) {
        return res.status(500).json({ message : err.message });
    }

}