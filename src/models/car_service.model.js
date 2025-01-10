import { connDB } from './dataBase.js';

const db = await connDB();

export const getCarServices = async car_ID => {

    const [ car_services ] = await db.query(`SELECT cs.*, s.service_name, s.description, s.price_type 
        FROM car_services cs INNER JOIN services s ON cs.service_ID = s.service_ID 
        WHERE cs.car_ID = ?`, [car_ID]);

    return car_services;

}

export const createCarService = async data => {

    const { car_ID, service_ID, price } = data

    await db.query(`INSERT INTO car_services (car_ID, service_ID, price) VALUES (?, ?, ?)`,
        [car_ID, service_ID, price]);

}

export const updatedCarService = async data => {
    const {car_service_ID, car_ID, service_ID, price } = data;
    await db.query(`UPDATE car_services SET car_ID = ?, service_ID = ?, price = ? 
                    WHERE car_service_ID = ?`, 
                    [car_ID, service_ID, price, car_service_ID]);


}

export const deleteCarService = async car_service_ID => {
    await db.query('DELETE FROM car_services WHERE car_service_ID = ?', [car_service_ID]);
}