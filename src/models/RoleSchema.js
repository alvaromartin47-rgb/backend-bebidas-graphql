import mongoose from 'mongoose';

const { Schema } = mongoose;

const roleSchema = new Schema({
    name: {type: String},
});

module.exports = mongoose.model('RoleSchema', roleSchema);