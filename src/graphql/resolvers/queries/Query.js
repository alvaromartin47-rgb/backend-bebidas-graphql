import fcs from './functions';
import { getPayload } from '../utils';
import { raise } from '../utils';

const Query = {
    ping() {
        return "pong";
    },
    async login(root, { input }, ctx) {
        try {
            return await fcs.validateUserAndPassword(input.userId, input.password);
        } catch (error) {
            throw new raise(error);
        }
    
    },
    users() {
        // const match = getPayload(ctx.token);
        return fcs.findUsers();
    },
    sessions() {
        return fcs.findSessions();
    }
}

export default Query;