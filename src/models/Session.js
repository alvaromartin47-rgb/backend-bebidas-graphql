import mongoose from 'mongoose';

const { Schema } = mongoose;

const sessionSchema = new Schema({
    userId: {type: String},
    start: {type: String},
    end: {type: String},
    status: {type: Boolean}
});

module.exports = mongoose.model('Session', sessionSchema);