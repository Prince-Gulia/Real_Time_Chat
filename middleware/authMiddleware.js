const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message : "No token Provided" });
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ message : "Invalid Token format" });
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch(err){
        console.error(err.message);
        return res.status(401).json({ message : "Token is Invalid or Expired" });
    }
}

module.exports = verifyToken;