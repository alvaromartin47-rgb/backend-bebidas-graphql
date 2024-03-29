import jwt from 'jsonwebtoken';

export default class Token {
    
    generateToken(body, exp) {
        return jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: exp
        });
    }

    static generate(body, exp, privatePwd) {
        return jwt.sign(body, privatePwd, {
            expiresIn: exp
        });
    }

    static verify(token, privatePwd) {
        return jwt.verify(token, privatePwd);
    }

    static decode(token) {
        return jwt.decode(token);
    }

}