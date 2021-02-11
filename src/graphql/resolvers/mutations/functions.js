import User from '../../../models/User';
import Session from '../../../models/Session';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function addSessionDb(userId) {
    const newSession = new Session({
        userId: userId,
        status_session: false
    });

    return await newSession.save();
}

async function addUserDb(schemaUser) {
    try {
        const newUser = new User(schemaUser);
        return await newUser.save();
    } catch (error) {
         return "";
    }
}

async function encryptPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {
    addUserDb,
    addSessionDb,
    encryptPassword
}