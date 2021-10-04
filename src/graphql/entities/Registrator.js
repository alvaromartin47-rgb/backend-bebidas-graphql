import UserSchema from '../../models/UserSchema';
import PasswordSchema from '../../models/PasswordSchema';
import Password from './Password';
import Order from './Order';

export default class Registrator {

    constructor(dataUser=null) {
        if (dataUser) this.dataUser = dataUser;
    }

    async addUserDb() {
        const password = this.dataUser.password;
        delete this.dataUser.password;

        const data = await UserSchema.find({
            email: this.dataUser.email
        });
    
        if (data.length != 0) throw Error("El email ingresado ya existe");
        
        const newUser = new UserSchema(this.dataUser);
        this.dataUser.password = password;

        return await newUser.save();
    }

    async addPasswordDb(userId) {
        const password = new Password(this.dataUser.password);

        const newPasswordSchema = new PasswordSchema({
            userId,
            hash: await password.encrypt()
        });
    
        return await newPasswordSchema.save();
    }

    async _addOrderDb(userId) {
        await Order.create(userId);
    }

    async register() {    
        const { _id } = await this.addUserDb();
        await this.addPasswordDb(_id);
        await this._addOrderDb(_id);
    }

}