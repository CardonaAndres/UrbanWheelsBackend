import { connDB } from "./dataBase.js";
const db = await connDB();

export const getAllUser = async (offset) => {

    const [ users ] = await db.query(`SELECT u.user_ID, u.name, u.email, u.number_doc, 
        u.age, u.cellphone, u.address, td.type_doc, td.type_doc_ID, r.rol_ID, r.rol_name 
        FROM type_docs td INNER JOIN users u ON u.type_doc_ID = td.type_doc_ID 
        INNER JOIN roles r ON r.rol_ID = u.rol_ID LIMIT 15 OFFSET ?`,[offset]);

        return users;

}

export const getUserById = async (userID) => {

    const [ user ] = await db.query(`SELECT u.user_ID, u.name, u.email, 
        u.number_doc, u.age, u.cellphone, u.address, 
        td.type_doc, td.type_doc_ID, r.rol_ID, r.rol_name FROM type_docs td 
        INNER JOIN users u ON u.type_doc_ID = td.type_doc_ID 
        INNER JOIN roles r ON r.rol_ID = u.rol_ID WHERE u.user_ID = ?` , [userID]);

    return user[0];

}

export const getUserByEmail = async (userEmail) => {

    const [ user ] = await db.query(`SELECT u.user_ID, u.name, u.email, u.number_doc, u.age, u.cellphone, u.address, 
        td.type_doc, td.type_doc_ID, r.rol_ID, r.rol_name FROM type_docs td 
        INNER JOIN users u ON u.type_doc_ID = td.type_doc_ID 
        INNER JOIN roles r ON r.rol_ID = u.rol_ID WHERE u.email = ?`, [userEmail]);

    return user[0];

}

export const getUsersByRol = async (rolID, offset) => {

    const [ users ] = await db.query(`SELECT  u.user_ID, 
    u.name, u.email, u.number_doc, u.age, u.cellphone, u.address, 
    td.type_doc, td.type_doc_ID, r.rol_ID, r.rol_name FROM 
    type_docs td INNER JOIN users u ON u.type_doc_ID = td.type_doc_ID 
    INNER JOIN roles r ON r.rol_ID = u.rol_ID WHERE u.rol_ID = ? LIMIT 15 OFFSET ?`,[rolID ,offset]);

    const [ totalUsers ] = await db.query(`SELECT COUNT(*) AS total FROM users WHERE rol_ID = ?`, [rolID])

    return { users, totalUsers : totalUsers[0].total};

}

export const getRoles = async () => {

    const [ roles ] = await db.query("SELECT * FROM roles");
    return roles;

}

export const countAllUsers = async () => {
    const [ users ] = await db.query(`SELECT COUNT(*) AS total FROM users`);
    return users[0].total;  
}

export const updatedUser = async (userData) => {

    const {idUser, name, email, type_doc_ID, number_doc, cellphone, age, address, rol_ID } = userData;

     await db.query(`UPDATE users SET name = ?, email = ?, type_doc_ID = ?, number_doc = ?,
      cellphone = ?, age = ?, address = ?, rol_ID = ? WHERE user_ID = ?`, 
      [name, email, type_doc_ID, number_doc, cellphone, age, address, rol_ID, idUser]);

}

export const deleteUser = async (userID) => {
    await db.query("DELETE FROM users WHERE user_ID = ? ", [userID]);
}
