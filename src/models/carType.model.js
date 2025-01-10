import { connDB } from "./dataBase.js";

const db = await connDB();

export const getCarTypes = async () => {

    const [ types ] = await db.query('SELECT * FROM car_types');
    return types;

}

export const exitsTypeCar = async (idTypeCar) => {

    const [ typeCar ] = await db.query('SELECT * FROM car_types WHERE car_type_ID = ?', [idTypeCar]);
    return typeCar.length > 0;

}

export const create = async (carTypeName) => {

    await db.query('INSERT INTO car_types (name_type) VALUES (?) ', [carTypeName])

}

export const update = async (idCar, type) => {

    await db.query('UPDATE car_types SET name_type = ? WHERE car_type_ID = ?',[type, idCar])

}

export const deleteType = async (idCar) => {
    
    await db.query('DELETE FROM car_types WHERE car_type_ID = ?', [idCar]);

}

