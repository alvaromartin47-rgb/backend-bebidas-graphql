import { MockList } from 'graphql-yoga';
import mongoose from 'mongoose';

const DB_NAME = "users";

const db = mongoose.connect('mongodb://localhost/' + (DB_NAME), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err));

module.exports = db;