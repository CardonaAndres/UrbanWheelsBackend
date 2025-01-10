import * as carTypeModel from "../models/carType.model.js";
import { getUserById } from "../models/auth.model.js";
import { hasPermission } from "../middlewares/authMiddleware.js";

export const getCarTypes = async (req, res) =>{

    try {

        const types = await carTypeModel.getCarTypes();
        return res.status(200).json( types )
        
    } catch (err) {
        return res.status(500).json({ message : err.message})
    }
    

}

export const createTypeCar = async (req, res) => {

    const user = await getUserById(req.user.id)
    const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
    if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
    
    try {

        const { name } = req.body
        await carTypeModel.create(name);
        res.status(201).json({ message : "Creado con exito"});

    } catch (err) {
        res.status(500).json({ message : err.message});
    }

}

export const deleteTypeCar = async(req, res) => {

    try {
        
        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);  
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
        

        const idTypeCar = req.params.id;
        const exits = await carTypeModel.exitsTypeCar(idTypeCar)

        if(!exits){
            return res.status(404).json({ message : "No se encuentra en la base de datos" });
        }

        await carTypeModel.deleteType(idTypeCar);
        return res.status(200).json({ message : "Eliminado con exito" });

    } catch(err) {
        return res.status(500).json({ message : err.message});
    }   


}

export const updateTypeCar = async(req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]); 

        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
      

        // ! Pendiente

    } catch (err) {
        res.status(500).json({ message : err.message });
    }


}