import Password from './Password';
import Registrator from './Registrator';
import Session from './Session';
import UserSchema from '../../models/UserSchema';
import EmailVerification from './EmailVerification';
import Sender from './Sender';
import OrderSchema from '../../models/OrderSchema';

export default class User {

    constructor(data=null) {
        this.data = data;
    }

    async register(email, password) {
        const dataUser = {
            name: this.data.name,
            lastname: this.data.lastname,
            phone: this.data.phone,
            account_verified: this.data.account_verified,
            role: this.data.role,
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

    static async deleteAllOrders() {
        const orders = await OrderSchema.find({});

        for (let i=0; i < orders.length; i++) {
            await OrderSchema.deleteOne({_id: orders[i]._id});
        }
    }

}