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
        return await fcs.processLogout(input.userId);
    }

}

export default Mutation;