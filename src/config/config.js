export const PORT = process.env.PORT || 5010;
export const SECRET_KEY = process.env.JWT_SECRET || 'mi_secreto_jwt';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
export const SERVER_ORIGIN = process.env.SERVER_ORIGIN || 'http://localhost:5010'; 

export const dbConfig = {
    host : "localhost",
    user : "root",
    password : "",
    database : "db_urbanwheels",
    port : 3306 
}

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
export const nameRegex = /^[a-zA-ZÀ-ÿ\s\-]+$/; 