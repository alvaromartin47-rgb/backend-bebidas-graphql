import env from 'node-env-file';
import User from './entities/User';
import UserSchema from '../../../models/UserSchema';

env("src/.env");

async function getUser(email, password) {
    const { name, lastname } = await UserSchema.find({email});
    
    return new User(name, lastname);
}

async function processSignIn(email, password) {
    const user = await getUser(email);

    return await user.login(email, password);
}

async function processSignUp(userSchema) {
    const user = new User(userSchema.name, userSchema.lastname);

    return await user.register(userSchema.email, userSchema.password);
}

// async function finishSession(_id) {
//     return await Session.findByIdAndUpdate(_id, {
//         status: false,
//         end: Date.now()
//     }, {new: true});
// }

module.exports = {
    processSignUp,
    processSignIn
}