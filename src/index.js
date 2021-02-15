import { server } from './server';
import env from 'node-env-file';
import './services/db/db';
import 'regenerator-runtime/runtime'

env("src/.env");

const serverTest = server.start({port: process.env.PORT}, () => {
    console.log("Server listening on port " + process.env.PORT);
});

module.exports = serverTest;