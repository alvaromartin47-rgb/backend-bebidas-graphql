import Password from './Password';
import Registrator from './Registrator';
import Session from './Session';
import UserSchema from '../../models/UserSchema';
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
            six_digit_code: null,
            email,
            password
        }

        const registrator = new Registrator(dataUser);
        await registrator.register();

        const sender = new Sender();
        const { message } = await sender.sendEmail6DigitCode(email);

        
        return {message};
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

    static async verifyCodeEmail(userId, sixDigitCode) {
        const { six_digit_code } = await UserSchema.findById(userId);

        if (sixDigitCode != six_digit_code) {
            throw new Error("El código de verificación es incorrecto");
        }

        await UserSchema.findByIdAndUpdate(userId, {
            account_verified: true,
            role: "User",
            six_digit_code: null
        });
    }

}