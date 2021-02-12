import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    hash: {type: String},
    email: {type: String}
});

module.exports = mongoose.model('User', userSchema);