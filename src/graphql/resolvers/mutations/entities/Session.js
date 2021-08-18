import SessionSchema from '../.../../../../../models/SessionSchema';
import jwt from 'jsonwebtoken';

export default class Session {

    startSession(_id) {
        const access_token = jwt.sign({id: _id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 3
        });
        
        const data = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        this.addSessionDb(data.id, data.iat, data.exp);
        
        return {access_token};
    }

    async addSessionDb(userId, iat, exp) {
        const newSession = new SessionSchema({
            userId,
            start: iat,
            end: exp,
            status: true
        });
    
        return await newSession.save();
    }

}