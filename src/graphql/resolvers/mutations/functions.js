import User from '../../../models/User';
import Session from '../../../models/Session';
import Password from '../../../models/Password';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'node-env-file';
import { raise } from '../utils';

env("src/.env");

async function processLogin(userId, password) {
    await isUserRegistred({_id: userId});
        
    await isSessionActive(userId);
    
    await isValidPassword(userId, password);

    return await startSession(userId);
}

// REFACTOR LOGOUT

function processLogout(userId) {
    return new Promise(async (resolve, reject) => {
        const data = await isSessionActive(userId);
        
        if (!data) return reject("Session is not active");
        
        return resolve(await finishSession(data._id));
    });
}

async function processSignIn(userSchema) {
    const password = userSchema.password       
    
    const userData = await addUserDb(userSchema);
    
    await addPasswordDb(userData._id, password);
    
    return userData;
}

async function addPasswordDb(userId, password) {
    const newPasswordSchema = new Password({
        userId,
        hash: await encryptPassword(password)
    });

    return await newPasswordSchema.save();
}

async function isUserRegistred(filters) {
    const userData = await User.find(filters);
    
    if (userData.length === 0) throw Error("User not found");
    return userData;
}

async function isSessionActive(userId) {
    const sessionData = await Session.find({userId, status: true});
    
    if (sessionData.length === 0) return sessionData;
    throw Error("Session is active");
}

async function isValidPassword(userId, password) {
    const { hash } = await Password.findOne({userId});
    
    const match = await bcrypt.compare(password, hash); 
    
    if (match) return userId;
    throw Error("Password is invalid");
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
    delete schemaUser.password

    try {
        const newUser = new User(schemaUser);
        return await newUser.save();
    } catch (err) {
        return Error("Email ingresed already exist");
    }
}

async function encryptPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {
    processLogin,
    processLogout,
    processSignIn,
}