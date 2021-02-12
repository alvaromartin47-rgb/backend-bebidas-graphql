import fcs from './functions';
import { raise } from '../utils';

const Mutation = {
    
    async signIn(root, { input }, ctx) {
        input.hash = await fcs.encryptPassword(input.password);
        
        // validar que pasa si el mail ya existe

        delete input.password;
        
        return await fcs.addUserDb(input);
    },

    async login(root, { input }, ctx) {
        try {
            return await fcs.processLogin(input.userId, input.password);
        } catch (error) {
            throw new raise(error);
        }
    
    },

    async logout(root, { input }, ctx) {
        try {
            return await fcs.processLogout(input.userId);
        } catch (error) {
            throw new raise(error);
        }
    }

}

export default Mutation;