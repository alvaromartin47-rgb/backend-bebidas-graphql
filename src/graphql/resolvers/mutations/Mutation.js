import fcs from './functions';

const Mutation = {
    async signIn(root, { input }, ctx) {
        input.hash = await fcs.encryptPassword(input.password);
        
        delete input.password;
        
        const user = await fcs.addUserDb(input);
        const session = fcs.addSessionDb(user._id);
        
        return user;
    }
}

export default Mutation;