import { connDB } from "./dataBase.js";

const db = await connDB();

export const getBrands = async () => {

    const [ brands ] = await db.query("SELECT * FROM brands");
    return brands;

}

export const getBrandById = async idBrand => {
    const [ brand ] = await db.query("SELECT * FROM brands WHERE brand_ID = ?", [idBrand]);
    return brand[0];
}

export const createBrand = async nameBrand => {

    await db.query("INSERT INTO brands (brand) VALUES (?)", [nameBrand]);

}

export const updateBrand = async (idBrand, nameBrand) => { 

    await db.query("UPDATE brands SET brand = ? WHERE brand_ID = ?", [nameBrand, idBrand]);

}

export const deleteBrand = async (idBrand) => { 
    
    await db.query("DELETE FROM brands WHERE brand_ID = ?", [idBrand]);

}