import User from '../../../models/User';
import Session from '../../../models/Session';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'node-env-file';

env("src/.env");

function processLogin(userId, password) {
    return new Promise(async (resolve, reject) => {
        if (!await isUserRegistred(userId)) return reject("User not found");
        
        if (await isSessionActive(userId)) return reject("Session is active");
        
        if (!await isValidPassword(userId, password)) return reject("Password is invalid");
        
        return resolve(startSession(userId));
    });
}

function processLogout(userId) {
    return new Promise(async (resolve, reject) => {
        const data = await isSessionActive(userId);
        
        if (!data) return reject("Session is not active");
        
        return resolve(await finishSession(data._id));
    });
}

async function isUserRegistred(userId) {
    try {
        return await User.findById(userId);   
    } catch (error) {
        return false;
    }
}

async function isSessionActive(userId) {
    const data = await Session.find({userId, status: true});
    return (data.length === 0) ? false: data[0]._id;
}

async function isValidPassword(userId, password) {
    const { hash } = await User.findById(userId);
    return await bcrypt.compare(password, hash);
}

async function startSession(userId) {
    return await addSessionDb(userId);
}

async function addSessionDb(userId) {
    const newSession = new Session({
        userId,
        start: Date.now(),
        end: null,
        status: true
    });

    return await newSession.save();
}

async function finishSession(_id) {
    return await Session.findByIdAndUpdate(_id, {
        status: false,
        end: Date.now()
    }, {new: true});
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
    processLogin,
    processLogout,
    encryptPassword,
    addUserDb
}