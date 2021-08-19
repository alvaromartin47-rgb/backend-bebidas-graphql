import Password from './Password';
import Registrator from './Registrator';
import Session from './Session';
import UserSchema from '../../../../models/UserSchema';
import EmailVerification from '../../../entities/EmailVerification';
import Sender from '../../../entities/Sender';

export default class User {

    constructor(name=null, lastname=null) {
        this.name = name;
        this.lastname = lastname;
    }

    async register(email, password) {
        const dataUser = {
            name: this.name,
            lastname: this.lastname,
            account_verified: false,
            email,
            password
        }

        const registrator = new Registrator(dataUser);
        await registrator.register();

        const sender = new Sender(new EmailVerification(email));
        const { message } = await sender.sendEmail();

        const { access_token } = await this.login(email, password);
        
        return {access_token, message};
    }
    
    static async getId(email) {
        try {
            const data = await UserSchema.find({email});
            return data[0]._id;
        } catch(err) {
            throw new Error("Email not exist");
        }  
    }

    async login(email, password) {
        const id = await User.getId(email);
        
        const pwd = new Password(password);
        await pwd.compareWithPasswordOf(id);

        const session = new Session();
        return await session.startSession(id);
    }

}