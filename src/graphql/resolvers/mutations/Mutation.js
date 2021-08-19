import fcs from './functions';

const Mutation = {
    async signUp(root, { input }, ctx) {
        return await fcs.processSignUp(input);
    },

    async signIn(root, { input }, ctx) {
        return await fcs.processSignIn(input.email, input.password);
    },

    updateProfile() {
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
}

export default Mutation;