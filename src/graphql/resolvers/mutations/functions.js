import env from 'node-env-file';
import User from './entities/User';
import UserSchema from '../../../models/UserSchema';
import EmailRecovery from '../../entities/EmailRecovery';
import Sender from '../../entities/Sender';

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

async function processRecover(email) {
    const sender = new Sender(new EmailRecovery(email));
    return await sender.sendEmail();
}

async function processUpdatePassword(token, last_pwd, new_pwd) {
    return {message: "Not implemented"}
}

async function processUpdatePasswordForRecovery(token, new_pwd) {
    return {message: "Not implemented"}
}

module.exports = {
    processSignUp,
    processSignIn,
    processRecover,
    processUpdatePassword,
    processUpdatePasswordForRecovery
}