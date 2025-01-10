import { connDB } from "./dataBase.js";
import bcrypt from "bcrypt";

const db = await connDB();

export const register = async (userData) => {

        const { name, email, type_doc_ID, number_doc, age, cellphone, address, 
            date_register, password } = userData;

        const [ result ] = await db.query(
            'INSERT INTO users (name, email, type_doc_ID, number_doc, age, cellphone, address, date_register, password, rol_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [name, email, type_doc_ID, number_doc, age, cellphone, address, date_register, password, 3]
        );

        return result.insertId;
}

export const logIn = async (email, password) => {

    const [ rows ] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if(!rows.length > 0){
        throw new Error('El usuario no existe');
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password);

    if(!isPasswordValid){
        throw new Error('Contraseña incorrecta');
    }

    return rows[0];

}

export const existUser = async (email) => {
    const [ user ] = await db.query(`SELECT * FROM users where email = ?`, [email]);
    return user.length > 0;
}

export const changePassword = async (email, newPassword) => {
    
    const [ user ] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    await db.query("UPDATE users SET password = ? WHERE user_ID = ?", [newPassword, user[0].user_ID]);

}

export const getUserById = async (id) => {
    const [ user ] = await db.query('SELECT * FROM users WHERE user_ID = ?', [id]);
    return user[0];
}

export const getUserByEmail = async (email) => {
    const [ user ] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
}

