import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';
import CategorySchema from '../../../models/CategorySchema';
import OrderSchema from '../../../models/OrderSchema';
import ProductSchema from '../../../models/ProductSchema';
import EmailVerification from '../../entities/EmailVerification'
import Session from '../../entities/Session';
import Token from '../../entities/Token';
import Sender from '../../entities/Sender';
import moment from 'moment';
import utils from '../utils';

async function findUsers(filters) {
    if (!filters) filters = {};
    return await UserSchema.find(filters);
}

async function findProducts(filters) {
    if (!filters) filters = {};
    return await ProductSchema.find(filters);
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

async function processFindOrders(filters) {
    if (!filters) filters = {};
    
    const orders = await OrderSchema.find(filters);

    const orders_updated = await utils.getProductsById(orders);

    return orders_updated;
}


module.exports = {
    findUsers,
    findSessions,
    processLogout,
    processReSendEmailVerification,
    processProfile,
    findCategories,
    findProducts,
    processFindOrders
}