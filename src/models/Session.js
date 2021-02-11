import mongoose from 'mongoose';

const { Schema } = mongoose;

const sessionSchema = new Schema({
    userId: {type: String},
    status_session: {type: Boolean}
});

module.exports = mongoose.model('Session', sessionSchema);