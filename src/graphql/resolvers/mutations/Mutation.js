import fcs from './functions';

const Mutation = {
    async signIn(root, { input }, ctx) {
        const hash = await fcs.encryptPassword(input.password);
        input.password = hash;
        const response = fcs.addUserDb(input);
        return response;
    }
}

export default Mutation;