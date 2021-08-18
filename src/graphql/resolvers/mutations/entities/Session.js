import SessionSchema from '../.../../../../../models/SessionSchema';
import jwt from 'jsonwebtoken';
import Password from './Password';

export default class Session {

    async startSession(id) {
        const { _id } = await this.addSessionDb(id);
        
        const body = {
            id,
            session_id: _id,
        }

        const access_token = jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 60 * 3
        });
        
        const data = jwt.decode(access_token);
        await SessionSchema.findByIdAndUpdate(data.session_id, {
            start: data.iat,
            end: data.exp}
        );
        
        return {access_token};
    }

    async addSessionDb(userId) {
        const newSession = new SessionSchema({
            userId,
            start: null,
            end: null,
            status: true,
        });
    
        return await newSession.save();
    }

    async getId(hash_token) {
        const data = await SessionSchema.find({hash_token});
        return data[0]._id;
    }

    async finishSession(session_id, update) {
        return await SessionSchema.findByIdAndUpdate(session_id, update, {new: true});
    }

    async status(session_id) {
        const { status } = await SessionSchema.findById(session_id);
        return status;
    }
}