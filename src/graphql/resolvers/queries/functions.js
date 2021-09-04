import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';
import CategorySchema from '../../../models/CategorySchema';
import ProductSchema from '../../../models/ProductSchema';
import EmailVerification from '../../entities/EmailVerification'
import Session from '../mutations/entities/Session';
import Token from '../../entities/Token';
import Sender from '../../entities/Sender';
import moment from 'moment';

async function findUsers(filters) {
    if (!filters) filters = {};
    return await UserSchema.find(filters);
}

async function findSessions() {
    return await SessionSchema.find();
}

async function getProductsForId(products) {
    const newProducts = [];

    for (let i=0; i < products.length; i++) {
        const product = await ProductSchema.findById(products[i]);
        newProducts.push(product);
    }

    return newProducts;
}

async function generateResponse(category) {
    const newCategory = category;

    const products = await getProductsForId(newCategory.products);
    newCategory.products = products;

    if (newCategory.sub_categories.length == 0) return newCategory;
    
    for (let i=0; i < newCategory.sub_categories.length; i++) {
        const idSubCategory = newCategory.sub_categories[i];
        const category = await CategorySchema.findById(idSubCategory);
        
        const obj = await generateResponse(category);

        newCategory.sub_categories[i] = obj;
    }
    
    return newCategory; 

}

async function findCategories(filters) {
    if (!filters) filters = {};
    const category = await CategorySchema.find(filters);
    const categories = [];

    for (let i=0; i < category.length; i++) {
        const obj = await generateResponse(category[i]);
        categories.push(obj);
    }
    
    return categories;
}

async function processLogout(access_token) {
    const { session_id } = Token.decode(access_token);

    return await Session.finishSession(session_id, {
        status: false,
        end: moment().unix()
    });
}

async function processVerifyEmail(access_token) {
    const { id } = Token.decode(access_token);

    await UserSchema.findByIdAndUpdate(id, {account_verified: true});

    const session = new Session();
    
    return {
        message: "Verification done correctly",
        access_token: (await session.startSession(id)).access_token,
    }
}

async function processReSendEmailVerification(access_token) {
    const { id } = Token.decode(access_token);
    const { email } = await UserSchema.findById(id);

    const sender = new Sender(new EmailVerification(email));
    return await sender.sendEmail();
}

async function processProfile(access_token) {
    const { id } = Token.decode(access_token);
    
    return await UserSchema.findById(id);
}


module.exports = {
    findUsers,
    findSessions,
    processLogout,
    processVerifyEmail,
    processReSendEmailVerification,
    processProfile,
    findCategories
}