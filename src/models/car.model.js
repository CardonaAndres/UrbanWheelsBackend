import { connDB } from "./dataBase.js";
const db = await connDB();


export const getCars = async (offset) => {

    const [ cars ] = await db.query(`SELECT c.*, st.name_state, br.brand, ct.name_type FROM cars c 
                                    INNER JOIN states st ON c.status_ID = st.state_ID
                                    INNER JOIN brands br ON c.brand_ID = br.brand_ID
                                    INNER JOIN car_types ct ON c.car_type_ID = ct.car_type_ID 
                                    LIMIT 15 OFFSET ?`,[offset]);

    return cars;

}

export const getCar = async (idCar) =>{

    const [ car ] = await db.query(`SELECT c.*, cty.name_type, b.brand, s.name_state FROM cars c
        INNER JOIN car_types cty ON c.car_type_ID = cty.car_type_ID
        INNER JOIN brands b ON c.brand_ID = b.brand_ID
        INNER JOIN states s ON c.status_ID = s.state_ID WHERE c.car_ID = ?`, idCar);

    return car[0];

}

export const getCarByPlate = async (plate) => {

    const [ car ] = await db.query(`SELECT c.*, cty.name_type, b.brand, s.name_state FROM cars c
        INNER JOIN car_types cty ON c.car_type_ID = cty.car_type_ID
        INNER JOIN brands b ON c.brand_ID = b.brand_ID
        INNER JOIN states s ON c.status_ID = s.state_ID WHERE c.plate = ?`, plate);

    return car[0];

}

export const checkPlate = async (plate) => {

    const [ car ] =  await db.query(`
        SELECT plate FROM cars WHERE plate = ? `, [plate]);

    return car.length > 0;
}

export const totalCars = async () => {
    const [ cars ] = await db.query(`SELECT COUNT(*) AS total FROM cars`);
    return cars[0].total;  
}

export const createCar = async (carData) => { 

    const {image_url, model, year, plate, kilometre, color, acquisition_date, 
        status_ID, brand_ID, car_type_ID} = carData;

    await db.query(`INSERT INTO cars 
        (image_url, model, year, plate, kilometre, color, acquisition_date, 
        status_ID, brand_ID, car_type_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [image_url, model, year, plate, kilometre, color, acquisition_date, 
        status_ID, brand_ID, car_type_ID]);


}

export const updateCar = async (carId, carData) => { 

    const { image_url, model, year, plate, kilometre, color, acquisition_date, 
        status_ID, brand_ID, car_type_ID } = carData;

        await db.query(`UPDATE cars SET image_url = ?, model = ?, year = ?, plate = ?, 
                        kilometre = ?, color = ?, acquisition_date = ?, status_ID = ?, 
                        brand_ID = ?, car_type_ID = ? WHERE car_ID = ?`, [ image_url, model, year, plate, 
                        kilometre, color, acquisition_date, status_ID, brand_ID, car_type_ID, carId ]);

}

export const deleteCar = async (idCar) => await db.query(`DELETE FROM cars WHERE car_ID = ?`, [idCar]);

