import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class Token {
    
    generateToken(body, exp) {
        return jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: exp
        });
    }

    static generate(body, exp) {
        return jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: exp
        });
    }

    static verify(token) {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }

    static decode(token) {
        return jwt.decode(token);
    }

    async encrypt(token) {
        const saltRounds = 10;
        return await bcrypt.hash(this.password, saltRounds);
    }

}