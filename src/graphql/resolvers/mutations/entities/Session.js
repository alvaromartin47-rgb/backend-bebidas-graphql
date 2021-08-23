import SessionSchema from '../.../../../../../models/SessionSchema';
import UserSchema from '../.../../../../../models/UserSchema';
import Token from '../../../entities/Token';


export default class Session {

    async startSession(id) {
        const { _id } = await this.addSessionDb(id);
        const { account_verified } = await UserSchema.findById(id);
        
        const body = {
            id,
            session_id: _id,
            account_verified,
        }

        const access_token = Token.generate(body, 60*3);
        const { session_id, iat, exp } = Token.decode(access_token);
        
        await SessionSchema.findByIdAndUpdate(session_id, {
            start: iat,
            end: exp
        });
        
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

    static async finishSession(session_id, update) {
        await SessionSchema.findByIdAndUpdate(session_id, update, {new: true});
        
        return {message: "Session finalized"};
    }

    static async status(session_id) {
        const { status } = await SessionSchema.findById(session_id);
        return status;
    }
}