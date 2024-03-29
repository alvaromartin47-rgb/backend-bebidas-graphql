import Emailer from './Emailer';
import Token from './Token';
import User from './User';

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

        return Token.generate(body, 60*5);
    }

    async sendEmailLink() {
        const recoverToken = await this.generateToken();

        const link = `${process.env.URI}/recovery_password?token=${recoverToken}`;
        const msj = `<a href=${link}>Click aquí para cambiar tu contraseña</a>`;

        const emailer = new Emailer(this.email, msj);
        await emailer.send();
        
        return {"message": "Check your inbox and click in the link that we sent"}
    }

}