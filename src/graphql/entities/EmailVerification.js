import Emailer from './Emailer';
import Token from './Token';
import User from '../resolvers/mutations/entities/User';

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

        return Token.generate(body, 60*5);
    }

    async sendEmail() {
        const registerToken = await this.generateToken();

        const link = `${process.env.URI}/verify_email?token=${registerToken}`;
        const msj = `Ingresa al siguiente link para verificar tu cuenta --> ${link}`;

        const emailer = new Emailer(this.email, msj);
        await emailer.send();
        
        return {message: "Check your inbox and verify email"}
    }

}