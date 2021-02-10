import fcs from './functions';

const Query = {
    ping() {
        return "pong";
    },
    login(root, { input }, ctx) {
        const session = fcs.validateUserAndPassword(input.userId, input.password);
        return session;
    },
    users() {
        return fcs.findUsers();
    }
}

export default Query;