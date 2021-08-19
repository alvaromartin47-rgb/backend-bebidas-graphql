import fcs from './functions';
import { verificatorA, verificatorB } from '../utils';

// Los verificadores de identidad deben chequear que la cuenta esté verificada para que
// se pueda acceder a recursos excepto ciertos casos que se especifican

const Query = {
    async ping(root, { input }, ctx) {
        await verificatorA(ctx.token);
        return "pong";
    },

    async users(root, { input }, ctx) {
        await verificatorA(ctx.token);
        return fcs.findUsers();
    },

    async sessions(root, { input }, ctx) {
        await verificatorA(ctx.token);
        return fcs.findSessions();
    },

    async verifyEmail(root, { input }, ctx) {
        await verificatorB(ctx.token);
        return await fcs.processVerifyEmail(ctx.token);
    },

    async logout(root, { input }, ctx) {
        await verificatorA(ctx.token);
        return await fcs.processLogout(ctx.token);
    },

    async reSendEmailVerification(root, { input }, ctx) {
        await verificatorB(ctx.token);
        return await fcs.processReSendEmailVerification(ctx.token);
    }
    
}

export default Query;