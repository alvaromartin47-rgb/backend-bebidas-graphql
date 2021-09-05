import bcrypt from 'bcrypt';
import PasswordSchema from '../../models/PasswordSchema';

export default class Password {

    constructor(password) {
        this.password = password;
    }

    async encrypt() {
        const saltRounds = 10;
        return await bcrypt.hash(this.password, saltRounds);
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