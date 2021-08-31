import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';
import EmailVerification from '../../entities/EmailVerification'
import Session from '../mutations/entities/Session';
import Token from '../../entities/Token';
import Sender from '../../entities/Sender';

async function findUsers(filters) {
    if (!filters) filters = {};
    return await UserSchema.find(filters);
}

async function findSessions() {
    return await SessionSchema.find();
}

async function generateResponse(category) {
    const newCategory = category;

    const products = getProductsForId(newCategory.products);
    newCategory.products = products;

    if (newCategory.sub_categories.length == 0) return newCategory;

    for (let i=0; i < newCategory.sub_categories.length; i++) {
        const sub_category = newCategory.sub_categories[i];
        
        obj = generateResponse(sub_category);
        
        newCategory.sub_categories.splice(i, 1);
        newCategory.sub_categories.splice(i, 0, obj);
    }
    
    return newCategory; 

}

async function findCategories(filters) {
    if (!filters) filters = {};
    const category = await CategorySchema.find(filters);

    return await generateResponse(category);
}

async function processLogout(access_token) {
    const { session_id } = Token.decode(access_token);

    return await Session.finishSession(session_id, {
        status: false,
        end: Date.now()
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