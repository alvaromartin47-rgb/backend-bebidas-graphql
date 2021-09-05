import env from 'node-env-file';
import User from '../../entities/User';
import Password from '../../entities/Password';
import fcsQ from '../queries/functions';
import UserSchema from '../../../models/UserSchema';
import ProductSchema from '../../../models/ProductSchema';
import CategorySchema from '../../../models/CategorySchema';
import EmailRecovery from '../../entities/EmailRecovery';
import PasswordSchema from '../../../models/PasswordSchema';
import Sender from '../../entities/Sender';
import Token from '../../entities/Token';

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

async function processSendEmailUpdatePassword(email) {
    const sender = new Sender(new EmailRecovery(email));
    return await sender.sendEmail();
}

async function processUpdatePassword(accessToken, new_pwd) {
    const { id } = Token.decode(accessToken);

    const password = new Password(new_pwd);
    
    await PasswordSchema.updateOne({userId: id}, {
        hash: await password.encrypt()
    });

    return "Password updated";
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

async function processUpdateProfile(accessToken, newProfile) {
    const { id } = Token.decode(accessToken);
    
    await UserSchema.updateOne({_id: id}, newProfile);

    return "Profile updated";
}

async function processDeleteUser(accessToken, password) {
    const { id } = Token.decode(accessToken);
    
    const pwd = new Password(password);
    await pwd.compareWithPasswordOf(id);

    await PasswordSchema.deleteOne({userId: id});
    await UserSchema.deleteOne({_id: id});

    await fcsQ.processLogout(accessToken);

    return "Deleted correctly";
}

module.exports = {
    processSignUp,
    processSignIn,
    processUpdatePassword,
    processAddCategory,
    processAddProduct,
    processUpdateProfile,
    processSendEmailUpdatePassword,
    processDeleteUser
}