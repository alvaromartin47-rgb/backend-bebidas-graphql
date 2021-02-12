import mongoose from 'mongoose';

const { Schema } = mongoose;

const passwordSchema = new Schema({
    userId: {type: String},
    hash: {type: String}
});

module.exports = mongoose.model('Password', passwordSchema);