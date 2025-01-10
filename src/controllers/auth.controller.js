import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { passwordRegex, nameRegex, SECRET_KEY } from "../config/config.js";
import { createTokenAccess } from "../libs/jwt.js";
import { getTypeDocById } from "../models/typeDoc.model.js";
import * as authModel from "../models/auth.model.js";

export const register = async (req, res) => {

    try {

        const { name, email, type_doc_ID, number_doc, age, cellphone, address,  password } = req.body;

        if(await authModel.existUser(email)){
            return res.status(400).json({ message : "Correo registrado en la base de datos" });
        }

        if (!name || !nameRegex.test(name)) {
            return res.status(400).json({ message: "Se requiere un nombre y debe contener solo letras (incluyendo tildes), espacios o guiones." });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Se requiere un correo electrónico válido." });
        }

        const existsTypeDoc = await getTypeDocById(type_doc_ID);

        if(!existsTypeDoc && number_doc.length < 5){
            return res.status(400).json({ message : "Verificar numero de documento o tipo" });
        }
            
        if (!age || !validator.isInt(age, { min: 18, max: 150 })) {
            return res.status(400).json({ message: "Debes ser mayor de edad" });
        }

        if (!cellphone || !validator.isMobilePhone(cellphone, 'any', { strict: false }) 
                && cellphone.length != 10 ) {
            return res.status(400).json({ message: "Número de celular no válido, recuerda que debe ser un número funcional en Colombia" });
        }

        if (!address || typeof address !== 'string' || address.trim().length === 0 || address.length < 4) {
            return res.status(400).json({ message: "La dirección es requerida." });
        }

        // Validación de la contraseña (mínimo 8 caracteres, al menos una letra mayúscula, una minúscula, un número y un carácter especial)

        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." });
        }
    
        const passwordHash = await bcrypt.hash(password, 10);
        const date = new Date().toISOString();

        const userId = await authModel.register({
            name, email, type_doc_ID, number_doc, age, cellphone, address, date_register : date, password : passwordHash
        });
        
        res.status(201).json({ message : "Usuario registrado con existo" });
            
    
    } catch (err) {
        res.status(500).json({ message : err.message })
    }
   
    
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authModel.logIn(email, password);

        if (!user) return res.status(400).json({ message: "Revisar usuario o contraseña" });
        
        const token = await createTokenAccess({ id : user.user_ID });

        res.cookie('token', token);

        // Enviar la respuesta con el token
        res.status(200).json({
            token,
            user: { id: user.user_ID, rol_ID : user.rol_ID, email: user.email},
            message: "Inicio de sesión exitoso"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logOut = async (req, res) => {
    try {
        
        res.cookie('token', '', {
            expires : new Date(0)
        });

        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
   
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const verifyToken = async (req, res) => {
    
    const { token } = req.cookies;

    jwt.verify(token, SECRET_KEY, async (err, user) => {

        if(err) return res.status(401).json({ message : "Por favor, iniciar sesion" });

        const userFound = await authModel.getUserById(user.id);
        if(!userFound) return res.status(401).json({ message : "Por favor, iniciar sesion" });

        return res.json({
            id : userFound.user_ID, 
            email : userFound.email, 
            rol_ID : userFound.rol_ID
        })

    });


};

export const chagePassword = async (req, res) => {

    try {

       const { email, newPassword } = req.body;
       
       const userExist = await authModel.existUser(email);
             
       if(!userExist || !newPassword){
        return res.status(400).json({ message : "Error, revisar el correo o la contraseña" });
       }

       const user = await authModel.getUserByEmail(email);
       const isSamePassword = await bcrypt.compare(newPassword, user.password);

       if(isSamePassword){  
            throw new Error("Revisar los datos");
       }

       if (!newPassword || !passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial." });
        }

       const passwordHash = await bcrypt.hash(newPassword, 10);

       await authModel.changePassword(email, passwordHash);

       res.status(200).json({ message : "Contraseña cambiada con exito" })

    } catch (err) {
        
        res.status(500).json({ message : err.message })

    }
    

}