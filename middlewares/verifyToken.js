const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).json({message: "Unauthorized Access" , status : false});
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({message: "Unauthorized Access", status : false});
        req.user = user;
        next();
    })
}