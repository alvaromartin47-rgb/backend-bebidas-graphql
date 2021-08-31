import env from 'node-env-file';
import User from './entities/User';
import UserSchema from '../../../models/UserSchema';
import ProductSchema from '../../../models/ProductSchema';
import CategorySchema from '../../../models/CategorySchema';
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
    const email = userSchema.email;
    const password = userSchema.password;
    
    delete userSchema.email;
    delete userSchema.password;

    const user = new User(userSchema);

    return await user.register(email, password);
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

async function processAddCategory(category) {
    const data = new CategorySchema(category);
    const { _id } = await data.save();

    return _id;
}

async function processAddProduct(product) {
    const data = new ProductSchema(product);
    const { _id } = await data.save();

    return _id;
}

module.exports = {
    processSignUp,
    processSignIn,
    processRecover,
    processUpdatePassword,
    processUpdatePasswordForRecovery,
    processAddCategory,
    processAddProduct
}