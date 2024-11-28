const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }

        // Check if it follows Bearer token format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Invalid token format. Use 'Bearer token'"
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user ID to request
        req.userId = decoded.id;
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired"
            });
        }
        return res.status(500).json({
            message: "Authentication failed"
        });
    }
};

module.exports = auth;
