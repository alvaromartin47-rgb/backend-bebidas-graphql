import env from 'node-env-file';
import Session from './mutations/entities/Session';
import Token from '../entities/Token';

env("src/.env");

async function verificatorA(token) {
    if (!token) throw new Error("Access token is required");
    const { session_id, account_verified } = Token.decode(token);
    
    try {
        const match = Token.verify(token);

        // Validación extra por si el token no expiro pero el usuario
        // cerró sesión y por si la cuenta no esta verificada.

        if (!await Session.status(session_id) || !account_verified) {
            // Modificar para hacer logout con la cuenta no verificada
            
            throw new Error();
        }
        
        return match
    } catch(err) {
        if (err.name == "TokenExpiredError") {
            // El objetivo del condicional es que solo se utilice cuando
            // el token expiró pero no se cerró la sesion en la db

            if (await Session.status(session_id)) {
                await Session.finishSession(session_id, {status: false});
            }

            throw new Error("Token expired");
        } else {
            // Casos donde el token es inválido por no coincidir o porque todavia
            // es valido pero el usuario cerro sesión y se invalidó en la db
            
            throw new Error("Token is invalid");
        }
    }
}

async function verificatorB(token) {
    if (!token) throw new Error("Access token is required");
    try {
        const match = Token.verify(token);
    } catch(err) {
        throw new Error("Token is invalid");
    }
}

module.exports = {
    verificatorA,
    verificatorB
}