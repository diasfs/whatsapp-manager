import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export default async (req, res, next) => {
    try {        
        let access_token = req.headers['authorization']||req.headers['x-access-token']||req.query.access_token;
        
        if (!access_token) {
            throw new Error("Unauthorized");
        }
        access_token = access_token.replace(/^Bearer\s*/, '');        
        
        let decoded = jwt.verify(access_token, process.env.JWT_SECRET);
        
        let user = await UserModel.findByPk(decoded.id);
        if (!user) {
            throw new Error("Unauthorized");
        }
        req.userId = decoded.id;

        next();

    } catch (err) {
        res.status(401).json({
            error: 'Unauthorized'
        });
    }
}