import fcs from './functions';
import { getPayload } from '../utils';

const Query = {
    ping() {
        return "pong";
    },
    login(root, { input }, ctx) {
        const session = fcs.validateUserAndPassword(input.userId, input.password);
        return session;
    },
    users(root, args, ctx) {
        const match = getPayload(ctx.token);
        return fcs.findUsers();
    }
}

export default Query;