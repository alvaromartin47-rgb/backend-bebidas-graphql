import Emailer from './Emailer';
import Token from './Token';
import User from '../resolvers/mutations/entities/User';

export default class EmailRecovery {
    
    constructor(email) {
        this.email = email
    }

    async generateToken() {
        const id = await User.getId(this.email);
        
        const body = {
            role: "UserRecover",
            id,
        }

        return Token.generate(body, process.env.EXPIRATION_RECOVER);
    }

    async sendEmail() {
        const recoverToken = await this.generateToken();

        const link = `${process.env.URI}/recovery_password?token=${recoverToken}`;
        const msj = `Ingresa al siguiente link para recuperar tu cuenta --> ${link}`;

        const emailer = new Emailer(this.email, msj);
        await emailer.send();
        
        return {message: "Check your inbox and click in the link that we sent"}
    }

}