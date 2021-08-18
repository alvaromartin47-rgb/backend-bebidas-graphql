import fcs from './functions';
import { getPayload } from '../utils';

const Query = {
    async ping(root, { input }, ctx) {
        // await getPayload(ctx.token);
        return "pong";
    },

    async users() {
        // await getPayload(ctx.token);
        return fcs.findUsers();
    },

    async sessions() {
        // await getPayload(ctx.token);
        return fcs.findSessions();
    },

    async verifyEmail() {
        // await getPayload(ctx.token);
        return {};
    },

    async logout(root, { input }, ctx) {
        // await getPayload(ctx.token);
        return await fcs.processLogout(ctx.token);
    }
}

export default Query;