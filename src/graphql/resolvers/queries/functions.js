import User from '../../../models/User';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function validateUserAndPassword(userId, password) {
    let hash;

    try {
        const user = await User.findById(userId);
        hash = user.password;
    } catch (error) {
        console.log(error);
        return {message: "The received id does not exist"};
    }
    
    const match = await bcrypt.compare(password, hash);
    
    // Comparo contraseña
    if (match) {
        // const refresh_token = jwt.sign({"data": {userId}}, "super-secret", {expiresIn: '1h'});
        // const access_token =  jwt.sign({"data": {userId}}, "super-secret", {expiresIn: '1h'});
        const message = "Login succesfully";
        
        return {
            // access_token,
            // refresh_token,
            message
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