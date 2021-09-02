import fcs from './functions';
import { isUser, isUserRecover } from '../utils'

const Mutation = {
    async signUp(root, { input }, ctx) {
        return await fcs.processSignUp(input);
    },

    async signIn(root, { input }, ctx) {
        return await fcs.processSignIn(input.email, input.password);
    },

    async updateProfile(root, { input }, ctx) {
        await isUser(ctx.token);
        return await fcs.processUpdateProfile(ctx.token, input);
    },

    async updatePassword(root, { input }, ctx) {
        await isUserRecover(ctx.token);
        return await fcs.processUpdatePassword(
            ctx.token,
            input.new_password
        );
    },

    async sendEmailUpdatePassword(root, { input }, ctx) {
        return await fcs.processSendEmailUpdatePassword(input.email);
    },

    async addCategory(root, { input }, ctx) {
        return await fcs.processAddCategory(input);
    },

    async addProduct(root, { input }, ctx) {
        return await fcs.processAddProduct(input);
    },

    async deleteUser(root, { input }, ctx) {
        return await fcs.processDeleteUser(ctx.token, input.password);
    }
    
}

export default Mutation;