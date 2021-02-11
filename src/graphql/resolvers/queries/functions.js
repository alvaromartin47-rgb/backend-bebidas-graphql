import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'node-env-file';

class UserInvalidId extends Error {
    constructor(message) {
      super(message)
    }
}

env("src/.env");

async function validateUserAndPassword(userId, password) {
    let hash;

    try {
        const user = await User.findById(userId);
        hash = user.password;
    } catch (error) {
        throw new UserInvalidId("ID recived is invalid");
    }
    
    const match = await bcrypt.compare(password, hash);
    
    if (match) {
        const refresh_token = jwt.sign({"data": {"privilige": "admin"}}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '10m'});
        const access_token =  jwt.sign({"data": {userId, "privilege":"user"}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
        
        return {
            access_token,
            refresh_token,
        }
    }

    return {message: "Password incorrect"};
    
}

async function findUsers() {
    return await User.find();
}

module.exports = {
    validateUserAndPassword,
    findUsers
}