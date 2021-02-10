import { server } from './server';
import env from 'node-env-file';
import './services/db/db';

env(__dirname + "/.env");

server.start({port: process.env.PORT}, () => {
    console.log("Server listening on port " + process.env.PORT);
});

