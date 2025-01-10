import mysql from "mysql2/promise";
import { dbConfig } from "../config/config.js";

export const connDB = async () => {

    try {

        const db = mysql.createPool(dbConfig);
        return db;

    } catch (err) {
        console.error("Error creating the database pool:", err);  // Registrar el error
        throw new Error("Failed to create database connection pool."); // Lanzar el error
    }
    
}
