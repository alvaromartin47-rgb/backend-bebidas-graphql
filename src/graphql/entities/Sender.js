import UserSchema from '../../models/UserSchema';
import Emailer from './Emailer';
import User from './User';

export default class Sender {

    constructor(type=null) {
        this.type = type;
    }

    async sendEmailLink() {
        return await this.type.sendEmail();
    }

    async sendEmail6DigitCode(email) {
        const userId = await User.getId(email);

        let code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        await UserSchema.findByIdAndUpdate(userId, {
            six_digit_code: code
        });

        const msj = `<h1>Tu código de verificación es ${code}</h1>`;

        const emailer = new Emailer(email, msj);
        await emailer.send();

        return {message: "Te enviamos un código de 6 digitos a tu casilla de correo"}
    }

}