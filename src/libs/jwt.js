import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

export const createTokenAccess = (payload) => {
    
    return new Promise((resolve, reject) => {

        jwt.sign(payload, SECRET_KEY, {
                expiresIn : "1d"
            }, (err, token) => {

                if(err){ 
                    reject(err) 
                } else { 
                    resolve(token) 
                }
                                                      
            }
        )

    })
}