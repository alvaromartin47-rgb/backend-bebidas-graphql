import express from 'express';
import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors'
import path from 'path';
import resolvers from './graphql/resolvers/index';

const app = express();
app.use(cors());

export const server = new GraphQLServer({
    express: app,
    typeDefs: path.join(__dirname, 'graphql/schema.graphql'),
    resolvers
});