import fcs from './functions';

const Mutation = {
    async signUp(root, { input }, ctx) {
        return await fcs.processSignUp(input);
    },

    async signIn(root, { input }, ctx) {
        return await fcs.processSignIn(input.userId, input.password);
    },

    updateProfile() {
        return {};
    },

    updatePassword() {
        return {};
    },

    recover() {
        return {};
    },
}

export default Mutation;