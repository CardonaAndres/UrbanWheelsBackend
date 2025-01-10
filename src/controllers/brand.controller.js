import * as branModel from "../models/brand.model.js"
import { getUserById } from "../models/auth.model.js";
import { hasPermission } from "../middlewares/authMiddleware.js";

export const getBrands = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);     
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
    
        const brans = await branModel.getBrands();
        res.status(200).json(brans);

    } catch (err) {
        res.status(500).json({message : err.message});
    }

}

const existBrand = async (brand) => {

    try {

        const brands = await branModel.getBrands();
        const brandExists = brands.some(obj => obj.brand.toLowerCase() === brand.toLowerCase());
        return brandExists; 
        
    } catch (err) {
        return null;  
    }

}

export const createBrand = async (req, res) => {

    try {

        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
        const { name_brand } = req.body;
        const brandExists = await existBrand(name_brand);
        
        
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
        
        if (name_brand.length < 3) return res.status(400).json({message : "Marca demasiado corta"});
        
        if (brandExists || brandExists === null) 
            return res.status(400).json({ message: "La marca se encuentra registrada en la DB" });
        

        await branModel.createBrand(name_brand.toUpperCase());

        res.status(201).json({message : "Marca creada con exito"});


    } catch (err) {
        res.status(500).json({message : err.message});
    }

}

export const updateBrand = async (req, res) => {

    try { 

        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
        
        if(!hasPerm.permission){
            return res.status(403).json({ message : hasPerm.message });
        }

        const idBrand = req.params.id;
        const { name_brand } = req.body;

        if (name_brand.length < 3) {
            return res.status(400).json({message : "Marca demasiado corta"});
        }

        await branModel.updateBrand(idBrand, name_brand.toUpperCase());

        res.status(200).json({message : "Actualizado con exito"});


    } catch (err) {

        res.status(500).json({ message : err.message });

    }

}

export const deleteBrand = async (req, res) => {

    try {

        const user = await getUserById(req.user.id);
        const hasPerm = await hasPermission(user.rol_ID, [ 1, 2 ]);
        
        if(!hasPerm.permission){
            return res.status(403).json({ message : hasPerm.message });
        }

        const idBrand = req.params.id;

        await branModel.deleteBrand(idBrand);

        res.status(200).json({ message : "Eliminado con exito" })

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }



}