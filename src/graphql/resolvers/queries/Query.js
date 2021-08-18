import fcs from './functions';
import { getPayload } from '../utils';

const Query = {
    ping(root, { input }, ctx) {
        console.log(getPayload(ctx.token))
        return "pong";
    },

    users() {
        // const match = getPayload(ctx.token);
        return fcs.findUsers();
    },

    sessions() {
        return fcs.findSessions();
    },

    verifyEmail() {
        return {};
    }
}

export default Query;