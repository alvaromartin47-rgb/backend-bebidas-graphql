import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function addUserDb(schemaUser) {
    try {
        const newUser = new User(schemaUser);
        const user = await newUser.save();
        return {user, message: "User registred succesfully"};
    } catch (error) {
        return {message: "Error"};  
    }
}

async function encryptPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {
    addUserDb,
    encryptPassword
}