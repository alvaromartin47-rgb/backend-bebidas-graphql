import env from 'node-env-file';
import Session from '../entities/Session';
import Token from '../entities/Token';

env("src/.env");

// const match = Token.verify(token);

// Todos los verificadores deben controlar que si el token es valido, la session tambien
// esté activa.

async function isSuperAdmin(accessToken) {
 
}

async function isRoleValid(accessToken) {
    // Debe verificar si el token es valido, y debe verificar si
    // el rol que tiene asignado el token pertenece a la base de datos
    // de roles.
}

async function isUserNotVerified(accessToken) {
    // Debe verificar si el token es valido, y debe verificar si
    // el rol que tiene asignado el token es exclusivamente UserNotVerified
}

async function isUser(accessToken) {
    // Debe verificar si el token es valido, y debe verificar si
    // el rol que tiene asignado el token es exclusivamente User
}

async function isUserRecover(accessToken) {
    // Debe verificar si el token es valido, y debe verificar si
    // el rol que tiene asignado el token es exclusivamente UserRecover

    const match = Token.verify(accessToken);
    const { role } = Token.decode(accessToken);

    if (role != "UserRecover") throw new Error("You don't have permissions");
}

function verifyExistToken(accessToken) {
    if (!token) throw new Error("Access token is required");
}

async function isRoleValidAndVerifyStatusSession(accessToken) {
    verifyExistToken(accessToken);
    const { session_id } = Token.decode(accessToken);
    
    try {
        isRoleValid(accessToken);

        // Validación extra por si el token no expiro pero el usuario
        // cerró sesión

        if (!await Session.status(session_id)) throw new Error();
        
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

module.exports = {
    isRoleValidAndVerifyStatusSession,
    isRoleValid,
    isUserNotVerified,
    isUser,
    isUserRecover,
    isSuperAdmin
}