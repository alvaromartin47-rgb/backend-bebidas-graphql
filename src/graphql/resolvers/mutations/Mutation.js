import fcs from './functions';
import { isUser, isUserRecover, isSuperAdmin } from '../utils';

const Mutation = {
    async signUp(root, { input }, ctx) {
        input.role = "UserNotVerified";
        input.account_verified = false;

        return await fcs.processSignUp(input);
    },

    async signUpAdmin(root, { input }, ctx) {
        await isSuperAdmin(ctx.token, process.env.ACCESS_TOKEN_SECRET);
        input.role = "Admin";
        input.account_verified = "false";

        return await fcs.processSignUp(input);
    },

    async signUpSuperAdmin(root, { input }, ctx) {
        input.role = "SuperAdmin";
        input.account_verified = "false";

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
        return await fcs.processUpdatePassword(
            ctx.token,
            input.six_digit_code,
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
    },

    async deleteProduct(root, { input }, ctx) {
        return await fcs.processDeleteProduct(input);
    },

    async updateProduct(root, { input }, ctx) {
        return await fcs.processUpdateProduct(input);
    },

    async addProductOrder(root, { input }, ctx) {
        return await fcs.processAddProductOrder(input, ctx.token);
    },

    async finalizeOrder(root, { input }, ctx) {
        return await fcs.processFinalizeOrder(input, ctx.token);
    },

    async deleteOrder(root, { input }, ctx) {
        return await fcs.processDeleteOrder(input.order_id);
    },

    async validatePayment(root, { input }, ctx) {
        await isSuperAdmin(ctx.token, process.env.PWD_PAYMENT);

        return await fcs.processValidatePayment(input, ctx.token);
    },

    async verifyEmail(root, { input }, ctx) {
        return await fcs.processVerifyEmail(input.email, input.six_digit_code);
    },
    
}

export default Mutation;