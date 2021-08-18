import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';
import Session from '../mutations/entities/Session';
import jwt from 'jsonwebtoken';

async function findUsers() {
    return await UserSchema.find();
}

async function findSessions() {
    return await SessionSchema.find();
}

async function processLogout(access_token) {
    const session = new Session();
    const { session_id } = jwt.decode(access_token);

    await session.finishSession(session_id, {
        status: false,
        end: Date.now()
    });

    return {message: "Session finalized"};
}

module.exports = {
    findUsers,
    findSessions,
    processLogout
}