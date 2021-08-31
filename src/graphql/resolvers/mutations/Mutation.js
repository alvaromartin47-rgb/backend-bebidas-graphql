import fcs from './functions';
import { verificatorA, verificatorB } from '../utils'

const Mutation = {
    async signUp(root, { input }, ctx) {
        return await fcs.processSignUp(input);
    },

    async signIn(root, { input }, ctx) {
        return await fcs.processSignIn(input.email, input.password);
    },

    async updateProfile(root, { input }, ctx) {
        await isUser(ctx.token);
        return {};
    },

    async updatePassword(root, { input }, ctx) {
        await isUser(ctx.token);
        return await fcs.processUpdatePassword(
            ctx.token,
            input.last_password,
            input.new_password
        );
    },

    async recover(root, { input }, ctx) {
        return await fcs.processRecover(input.email);
    },

    async updatePasswordForRecovery(root, { input }, ctx) {
        await isUserRecover(ctx.token);
        return await fcs.processUpdatePasswordForRecovery(
            ctx.token,
            input.new_password
        );
    },

    async addCategory(root, { input }, ctx) {
        return await fcs.processAddCategory(input);
    },

    async addProduct(root, { input }, ctx) {
        return await fcs.processAddProduct(input);
    }
}

export default Mutation;