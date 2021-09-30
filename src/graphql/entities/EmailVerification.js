import Emailer from './Emailer';
import Token from './Token';
import User from './User';

export default class EmailVerification {

    constructor(email) {
        this.email = email;
    }

    async generateToken() {
        const id = await User.getId(this.email);
        
        const body = {
            role: "UserNotVerified",
            id
        }

        return Token.generate(body, 60*5, process.env.ACCESS_TOKEN_SECRET);
    }

    async sendEmail() {
        const registerToken = await this.generateToken();

        const link = `${process.env.URI}/verify_email?token=${registerToken}`;
        const msj = `<a href=${link}>Click aquí para verificar tu cuenta</a>`;

        const emailer = new Emailer(this.email, msj);
        await emailer.send();
        
        return {message: "Check your inbox and verify email"}
    }

}