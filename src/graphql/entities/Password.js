import bcrypt from 'bcryptjs';
import PasswordSchema from '../../models/PasswordSchema';

export default class Password {

    constructor(password) {
        this.password = password;
    }

    async encrypt() {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(this.password, salt);
    }

    async compare(hash) {
        return await bcrypt.compare(this.password, hash);
    }

    async compareWithPasswordOf(userId) {
        const { hash } = await PasswordSchema.findOne({userId});
        const match = await this.compare(hash); 
        
        if (match) return userId;
        throw Error("Password is invalid");
    }

}