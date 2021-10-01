import mercadopago from 'mercadopago';
import Token from './Token';

export default class Payment {

    constructor(publicKey, accessToken) {
        this.publicKey = publicKey;
        this.accessToken = accessToken;
        
        mercadopago.configurations.setAccessToken(this.accessToken); 
    }

    async createPreference(params, payload) {
        const accessToken = Token.generate(
            payload,
            60*10,
            process.env.PWD_PAYMENT
        )

        let preference = {
            items: [params],
            back_urls: {
                "success": `https://payment.loca.lt/success/${accessToken}`,
                "failure": `${process.env.URI}/failure`,
                "pending": `${process.env.URI}/pending`
            },
            auto_return: 'approved',
        };
        
        const data = await mercadopago.preferences.create(preference)
        
        return data.body.id;
    }

}