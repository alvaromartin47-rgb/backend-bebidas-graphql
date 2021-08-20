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
        await verificatorA(ctx.token);
        return {};
    },

    async updatePassword(root, { input }, ctx) {
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
        await verificatorB(ctx.token);
        return await fcs.processUpdatePasswordForRecovery(
            ctx.token,
            input.new_password
        );
    }
}

export default Mutation;