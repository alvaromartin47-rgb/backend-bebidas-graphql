import User from '../../../models/User';
import Session from '../../../models/Session';
import jwt from 'jsonwebtoken';

async function findUsers() {
    return await User.find();
}

async function findSessions() {
    return await Session.find();
}

module.exports = {
    findUsers,
    findSessions
}