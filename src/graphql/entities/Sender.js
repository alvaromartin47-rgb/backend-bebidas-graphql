export default class Sender {

    constructor(type) {
        this.type = type;
    }

    async sendEmail() {
        return await this.type.sendEmail();
    }

}