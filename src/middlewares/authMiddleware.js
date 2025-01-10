import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';

export const authMiddleware = (req, res, next) => {
    
    const { token } = req.cookies;

    if(!token){
        return res.status(401).json({ messgae : "No token, Authorization Denied" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err){
            return res.status(401).json({ message : "Invalid Token" });
        }

        req.user = user;

        next();

    });

};


export const hasPermission = async (userRolID, rolesAccepts) => {

  try {

      if(rolesAccepts.includes(userRolID)){
          return { 
              message : "You have permission",
              permission : true
          }
      } else {
          return { 
              message : "You dont have permission",
              permission : false
          }
      }

  } catch (err) {

      return { 
        message : "An error occurred: " + err.message,
        permission : false
    }

  }

}
