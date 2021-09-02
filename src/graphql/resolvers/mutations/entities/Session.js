import SessionSchema from '../.../../../../../models/SessionSchema';
import UserSchema from '../.../../../../../models/UserSchema';
import Token from '../../../entities/Token';


export default class Session {

    async startSession(id) {
        const { _id } = await this._addSessionDb(id);
        const role = await this._getRole(id);

        const body = {
            id,
            session_id: _id,
            role
        }

        const access_token = Token.generate(body, 60*5);
        const { session_id, iat, exp } = Token.decode(access_token);
        
        await SessionSchema.findByIdAndUpdate(session_id, {
            start: iat,
            end: exp
        });
        
        return {access_token};
    }

    async _getRole(id) {
        const { account_verified } = await UserSchema.findById(id);
        
        if (account_verified) return "UserNotVerified";
        return "User";
    }

    async _addSessionDb(userId) {
        const newSession = new SessionSchema({
            userId,
            start: null,
            end: null,
            status: true,
        });
    
        return await newSession.save();
    }

    static async finishSession(sessionId, update) {
        await SessionSchema.findByIdAndUpdate(sessionId, update, {new: true});
        
        return {message: "Session finalized"};
    }

    static async status(sessionId) {
        const { status } = await SessionSchema.findById(sessionId);
        return status;
    }
}