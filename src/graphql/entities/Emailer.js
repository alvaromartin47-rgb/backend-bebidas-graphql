import nodemailer from 'nodemailer';

export default class Emailer {
    
    constructor(address, html) {
        this.address = address;
        this.html = html;

        this.transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send() {
        await this.transport.sendMail({
            from: `Bebidas Trank <$(proccess.env.EMAIL_ADDRESS)>`,
            to: [this.address],
            subject: "Email de verificación",
            html: this.html
        });
    }
    
}