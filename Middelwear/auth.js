const jwt = require('jsonwebtoken');
const userModel = require('../DB/models/userModel');
const Roles = {
    user: 'user',
    admin: 'admin'
};

const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            const headerToken = req.headers['authorization'];
            if (!headerToken || !headerToken.startsWith('Bearer ')) {
                res.status(400).json({ message: 'in-valid header Token' })
            } else {
                const Token = headerToken.split(' ')[1];
                const decoded = jwt.verify(Token, process.env.jwt_secret);
                if (!decoded) {
                    res.status(400).json({ message: 'in valid token' })
                } else {
                    const user = await userModel.findById(decoded.id);
                    if (!user) {
                        res.status(404).json({ message: 'Not Found User' });
                    } else {
                        if (!accessRoles.includes(user.role)) {
                            res.status(401).json({ message: 'not authorize' });
                        } else {
                            req.user = user;
                            next();
                        }
                    }
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'catch err', error })
        }
    }
}


module.exports = { auth, Roles };