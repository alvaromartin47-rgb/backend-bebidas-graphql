import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import env, { data } from 'node-env-file';
import Session from './mutations/entities/Session';

env("src/.env");

async function getPayload(token) {
    const session = new Session();
    const { session_id } = jwt.decode(token);
    
    try {
        const match = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Validación extra por si el token no expiro pero el usuario
        // cerró sesión.

        if (!await session.status(session_id)) throw new Error();
        
        return match
    } catch(err) {
        if (err.name == "TokenExpiredError") {
            // El objetivo del condicional es que solo se utilice cuando
            // el token expiró pero no se cerró la sesion en la db
            
            if (await session.status(session_id)) {
                await session.finishSession(session_id, {status: false});
            }

            throw new Error("Token expired");
        } else {
            // Casos donde el token es inválido por no coincidir o porque todavia
            // es valido pero el usuario cerro sesión y se invalidó en la db
            
            throw new Error("Token is invalid");
        }
    }
}

module.exports = {
    getPayload
}