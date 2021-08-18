import UserSchema from '../../../../models/UserSchema';
import PasswordSchema from '../../../../models/PasswordSchema';
import Password from './Password';  

export default class Registrator {

    constructor(dataUser=null) {
        if (dataUser) this.dataUser = dataUser;
    }

    async addUserDb() {
        const password = this.dataUser.password;
        delete this.dataUser.password;

        try {
            const newUser = new UserSchema(this.dataUser);
            this.dataUser.password = password;
            return await newUser.save();
        } catch(err) {
            return Error("Email ingresed already exist");
        }
    }

    async addPasswordDb(userId) {
        const password = new Password(this.dataUser.password);
        
        const newPasswordSchema = new PasswordSchema({
            userId,
            hash: await password.encrypt()
        });
        
        return await newPasswordSchema.save();
    }

    async register() {
        const { _id } =  await this.addUserDb();
        await this.addPasswordDb(_id);
    }

}