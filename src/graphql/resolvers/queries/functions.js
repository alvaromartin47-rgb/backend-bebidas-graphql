import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';

async function findUsers() {
    return await UserSchema.find();
}

async function findSessions() {
    return await SessionSchema.find();
}

module.exports = {
    findUsers,
    findSessions
}