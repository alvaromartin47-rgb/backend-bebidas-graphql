import mongoose from 'mongoose';

const DB_NAME = "users";

mongoose.connect('mongodb://database/' + (DB_NAME), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err));