import * as userModel from "../models/user.model.js";
import { getUserById,} from "../models/auth.model.js";
import { getTypeDocById } from "../models/typeDoc.model.js";
import { nameRegex } from "../config/config.js";
import validator from "validator";
import { hasPermission } from "../middlewares/authMiddleware.js";

export const getAllUsers = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { page = 1 } = req.query; 
        const offset = (page - 1) * 15;   
        const totalUsers = await userModel.countAllUsers();
        const users = await userModel.getAllUser(offset);
        const totalPages = Math.ceil(totalUsers / 15);

        return res.status(200).json({ users, 
                pagination: { 
                    currentPage: parseInt(page),
                    totalPages: totalPages, 
                    totalUsers: totalUsers, 
                }, message : "Tarea exitosa" });
        

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
    
}

export const getUsersByRol = async (req, res) => {
    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);     
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { page = 1 , rolID = 0 } = req.query; 
   
        if (!rolID || isNaN(rolID)) return res.status(400).json({ message: 'El rolID es obligatorio' });
          
        const offset = (page - 1) * 15;   
        const modelData = await userModel.getUsersByRol(rolID, offset);
        const totalPages = Math.ceil(modelData.totalUsers / 15);

        return res.status(200).json({ 
            users : modelData.users, pagination : {
                currentPage: parseInt(page),
                totalUsers : modelData.totalUsers,
                totalPages
            }
         })

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
    
}

export const getUserByEmail = async (req, res) => {

    try {
        const user = await getUserById(req.user.id); 
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);       
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { LookForEmail } = req.body;
        const userRequired = await userModel.getUserByEmail(LookForEmail);
        if(!userRequired) return res.status(404).json({ message : "Lo sentimos, usuario no encontrado" });

        return res.status(200).json(userRequired);

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }

}

export const getUser =  async (req, res) => {

    try { 

        const user = await userModel.getUserById(req.user.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });  
        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json({ message : err.message })
    }

}

export const updatedUser = async (req, res) => {

    try { 
        const user = await getUserById(req.user.id); 
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);       
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { idUser, name, email, type_doc_ID, number_doc, cellphone, age, address, rol_ID  } = req.body
        const existsDoc = await getTypeDocById(type_doc_ID);

        if (!name || !nameRegex.test(name)) 
            return res.status(400).json({ message: "Se requiere un nombre y debe contener solo letras (incluyendo tildes), espacios o guiones." })
        
        if (!email || !validator.isEmail(email)) 
            return res.status(400).json({ message: "Se requiere un correo electrónico válido." })

        if (!existsDoc) 
            return res.status(400).json({ message: "El tipo de documento especificado no es válido." })

        if (!number_doc || number_doc.length < 5) 
            return res.status(400).json({ 
                message: "El número de documento debe tener al menos 5 caracteres." });
              
        if (!age || !validator.isInt(String(age), { min: 18, max: 150 })) 
            return res.status(400).json({ 
            message: "La edad debe ser un número entero válido y ser mayor de 18 años." });
        
        if (!cellphone || !validator.isMobilePhone(cellphone, 'es-CO')) 
            return res.status(400).json({ 
            message: "Número de celular no válido. Debe ser un número de 10 dígitos válido en Colombia." });
        

        if (!address || typeof address !== 'string' || address.trim().length < 4) 
            return res.status(400).json({ 
                message: "La dirección es obligatoria y debe contener al menos 4 caracteres." });
        
       
        await userModel.updatedUser({ idUser, name, email, type_doc_ID, 
        number_doc, cellphone, age, address, rol_ID});

       res.status(200).json({ message : "Su información ha sido actualizada con exito" });
        
    } catch (err) {
        res.status(500).json({ message : err.message });
    }

}

export const deleteUser = async (req, res) => {
    try {
        const user = await getUserById(req.user.id); 
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);       
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const userDelete = req.params.id;
        await userModel.deleteUser(userDelete);
        return res.status(200).json({ message : "Usuario borrado con exito" });

    } catch (err) {
        res.status(500).json({ message : err.message })
    }
}

export const getRoles = async (req, res) => {
    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const roles = await userModel.getRoles();

        return res.status(200).json( roles );

    } catch (err) {
        return res.status(500).json({ message : err.message });
    }
}
