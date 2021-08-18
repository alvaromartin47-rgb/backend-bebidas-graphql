import Password from './Password';
import Registrator from './Registrator';
import Session from './Session';
import UserSchema from '../../../../models/UserSchema';

export default class User {

    constructor(name, lastname) {
        this.name = name;
        this.lastname = lastname;
    }

    async register(email, password) {
        const dataUser = {
            name: this.name,
            lastname: this.lastname,
            email,
            password
        }

        const registrator = new Registrator(dataUser);
        await registrator.register();

        return await this.login(email, password);
    }
    
    async getId(email) {
        return await UserSchema.find({email})._id;
    }

    async login(email, password) {
        const id = await this.getId(email);

        const pwd = new Password(password);
        await pwd.compareWithPasswordOf(id);

        const session = new Session();
        return await session.startSession(id);
    }

}