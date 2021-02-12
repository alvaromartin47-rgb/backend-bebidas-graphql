import fcs from './functions';
import { getPayload } from '../utils';
import { raise } from '../utils';

const Query = {
    ping() {
        return "pong";
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