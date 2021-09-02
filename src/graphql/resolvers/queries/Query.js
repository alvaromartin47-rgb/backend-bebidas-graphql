import fcs from './functions';
import { 
    isUserNotVerified,
    isRoleValid,
    isRoleValidAndVerifyStatusSession
} from '../utils';

const Query = {
    async ping(root, { input }, ctx) {
        return "pong";
    },

    async users(root, { filters }, ctx) {
        return await fcs.findUsers(filters);
    },

    async sessions(root, { input }, ctx) {
        return await fcs.findSessions();
    },

    async categories(root, { filters }, ctx) {
        return await fcs.findCategories(filters);
    },

    async verifyEmail(root, { input }, ctx) {
        await isUserNotVerified(ctx.token);
        return await fcs.processVerifyEmail(ctx.token);
    },

    async logout(root, { input }, ctx) {
        await isRoleValidAndVerifyStatusSession(ctx.token);
        return await fcs.processLogout(ctx.token);
    },

    async reSendEmailVerification(root, { input }, ctx) {
        await isUserNotVerified(ctx.token);
        return await fcs.processReSendEmailVerification(ctx.token);
    },
    
    async profile(root, { input }, ctx) {
        await isRoleValid(ctx.token);
        return await fcs.processProfile(ctx.token);
    }
    
}

export default Query;