import jwt from 'jsonwebtoken';
import env from 'node-env-file';

env("src/.env");

class raise extends Error {
    constructor(message) { 
        super(message);
    }
}

function getPayload(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {
    getPayload,
    raise
}