const jwt = require('jsonwebtoken');

class Token {
    
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

    static verify(token, privatePwd) {
        return jwt.verify(token, privatePwd);
    }

    static decode(token) {
        return jwt.decode(token);
    }

}

module.exports = Token;