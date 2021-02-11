import User from '../../../models/User';
import Session from '../../../models/Session';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'node-env-file';

env("src/.env");

function validatePassword(password, hash) {
    return new Promise(async (resolve, reject) => {
        const match = await bcrypt.compare(password, hash);
        if (match) resolve(true);
        return reject("Invalid password");
    });
}

function validateUserAndPassword(userId, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const { _id, hash } = await User.findById(userId);
            const ok = await validatePassword(password, hash);
            return resolve(await Session.findOneAndUpdate({userId: _id}, {status_session: true}));

        } catch (error) {
            return reject(error);
        }
    });
}

async function findUsers() {
    return await User.find();
}

async function findSessions() {
    return await Session.find();
}

module.exports = {
    validateUserAndPassword,
    findUsers,
    findSessions
}