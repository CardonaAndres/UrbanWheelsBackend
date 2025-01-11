import * as typeDocModel from "../models/typeDoc.model.js";
import { getUserById } from "../models/auth.model.js";
import { hasPermission } from "../middlewares/authMiddleware.js";

export const getTypeDocs = async (req, res) => {

    try {
        const typeDocs = await typeDocModel.getTypeDocs();
        res.status(200).json( typeDocs );
    } catch (err) {
        res.status(500).json({ message : "Error, por favor volver a intentarlo" })
    }

}

export const getTypeDocById = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });
        

        const typeDoc = await typeDocModel.getTypeDocById(req.params.id);
        if (!typeDoc) return res.status(404).json({ message : "Tipo de documento no encontrado" });
        res.status(200).json(typeDoc)
    

    } catch (err) {
        res.status(500).json({ message : "Error, por favor volver a intentarlo" })
    }

}

export const createTypeDoc = async (req, res) => {

    try {

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission) return res.status(403).json({ message : hasPerm.message });

        const { typeDoc } = req.body;   
        await typeDocModel.createTypeDoc(typeDoc);
        res.status(200).json({ message : "Tipo de documento creado con exito" });
        

    } catch (err) {
        res.status(500).json({ message : err.message })
    }

}

export const updateTypeDoc = async (req, res) => {

    try{

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission){
            return res.status(403).json({ message : hasPerm.message });
        }

        const { typeDoc } = req.body;
        await typeDocModel.updateTypeDoc(req.params.id, typeDoc);
        return res.status(200).json({ message : "Tipo de documento actualizado con exito" });
    

    } catch (err){
        res.status(500).json({ message : "Error, por favor volver a intentarlo" })
    }

}


export const deleteTypeDoc = async (req, res) => {

    try{

        const user = await getUserById(req.user.id)
        const hasPerm = await hasPermission(user.rol_ID, [ 1 ]);
        
        if(!hasPerm.permission){
            return res.status(403).json({ message : hasPerm.message });
        }

        await typeDocModel.deleteTypeDoc(req.params.id);
        res.status(200).json({ message : 'Borrado con exito' })
    

    } catch (err){
        res.status(500).json({ message : "Error, por favor volver a intentarlo" })
    }

}
