import fcs from './functions';
import { raise } from '../utils';

const Mutation = {
    
    async signIn(root, { input }, ctx) {
        return await fcs.processSignIn(input);
    },

    async login(root, { input }, ctx) {
        return await fcs.processLogin(input.userId, input.password);
    },

    async logout(root, { input }, ctx) {
        try {
            return await fcs.processLogout(input.userId);
        } catch (error) {
            return error;
        }
    }

}

export default Mutation;