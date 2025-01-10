import { connDB } from "./dataBase.js";

const db = await connDB();

export const getTypeDocs = async () => {
    const [ type_docs ] = await db.query('SELECT * FROM type_docs');
    return type_docs;
}

export const getTypeDocById = async (idTypeDoc) => {
    const [ type_doc ] = await db.query('SELECT * FROM type_docs WHERE type_doc_ID = ?', [idTypeDoc]);
    return type_doc[0]
}

export const createTypeDoc = async (typeDoc) => {
    await db.query('INSERT INTO type_docs (type_doc) VALUES (?) ', [typeDoc]);
}

export const updateTypeDoc = async (idTypeDoc, typeDoc) => {
    await db.query('UPDATE type_docs SET type_doc = ? WHERE type_doc_ID = ?', [typeDoc, idTypeDoc]);
}

export const deleteTypeDoc = async (idTypeDoc) => {
    await db.query('DELETE FROM type_docs WHERE type_doc_ID = ?',[idTypeDoc])
}