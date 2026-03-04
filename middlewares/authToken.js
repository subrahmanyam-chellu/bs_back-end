const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(req, res, next){
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            console.log("token not found")
            return res.status(404).send("token not found");
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
         req.user = decoded;
        //console.log(decoded);
        next();

    }catch(err){
        return res.status(401).send("invalid token");
    }
    
}