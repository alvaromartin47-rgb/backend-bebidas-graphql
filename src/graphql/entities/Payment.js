import mercadopago from 'mercadopago';

export default class Payment {

    constructor(publicKey, accessToken) {
        this.publicKey = publicKey;
        this.accessToken = accessToken;
        
        mercadopago.configurations.setAccessToken(this.accessToken); 
    }

    async createPreference(params) {
        let preference = {
            items: [params],
            back_urls: {
                "success": `${process.env.URI}/success`,
                "failure": `${process.env.URI}/failure`,
                "pending": `${process.env.URI}/pending`
            },
            auto_return: 'approved',
        };
        
        const data = await mercadopago.preferences.create(preference)
        
        return data.body.id;
    }

    validate(resultTransaction) {
        // Hacer algo
    }
}