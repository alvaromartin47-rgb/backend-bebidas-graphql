import UserSchema from '../../../models/UserSchema';
import SessionSchema from '../../../models/SessionSchema';
import EmailVerification from '../../entities/EmailVerification'
import Session from '../mutations/entities/Session';
import Token from '../../entities/Token';
import Sender from '../../entities/Sender';

async function findUsers(filters) {
    if (!filters) filters = {};
    return await UserSchema.find(filters);
}

async function findSessions() {
    return await SessionSchema.find();
}

async function processLogout(access_token) {
    const { session_id } = Token.decode(access_token);

    return await Session.finishSession(session_id, {
        status: false,
        end: Date.now()
    });
}

// Refactor
async function processVerifyEmail(access_token) {
    const { id, type } = Token.decode(access_token);
    const { account_verified } = await UserSchema.findById(id);

    if (type != "Verification" || account_verified) {
        throw new Error("Token is invalid");
    }

    await UserSchema.findByIdAndUpdate(id, {account_verified: true});

    const session = new Session();
    
    return {
        message: "Verification done correctly",
        access_token: (await session.startSession(id)).access_token,
    }
}

// Refactor
async function processReSendEmailVerification(access_token) {
    const { id } = Token.decode(access_token);
    const { account_verified } = await UserSchema.findById(id);

    if (account_verified) throw new Error("Account already verified");

    const { email } = await UserSchema.findById(id);

    const sender = new Sender(new EmailVerification(email));
    return await sender.sendEmail();
}

async function processProfile(access_token) {
    const { id } = Token.decode(access_token);
    
    return await UserSchema.findById(id);
}

module.exports = {
    findUsers,
    findSessions,
    processLogout,
    processVerifyEmail,
    processReSendEmailVerification,
    processProfile
}