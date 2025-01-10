import { connDB } from './dataBase.js'

const db = await connDB();

export const getServices = async () => {

    const [ services ] = await db.query('SELECT * FROM services');
    return services;

}

export const getServiceByID = async service_ID => {

    const [ service  ]= await db.query('SELECT * FROM services WHERE service_ID = ?', [service_ID]);
    return service[0]

}

export const createService = async data => {

    const { service_name, description, price_type } = data;
    await db.query(`INSERT INTO services (service_name, description, price_type) VALUES (?, ?, ?)`,
        [ service_name, description, price_type ])

}

export const updateService = async data => {
   const { service_ID, service_name, description, price_type } = data;
   await db.query(`UPDATE services SET service_name = ?, description = ?, price_type = ? 
    WHERE service_ID = ?`, [service_name, description, price_type, service_ID])

}

export const deleteService = async service_ID => {
    await db.query('DELETE FROM services WHERE service_ID = ?', [ service_ID ]);
}