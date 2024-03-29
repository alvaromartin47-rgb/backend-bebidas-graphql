import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    email: {
        type: String,
        unique: true
    },
    account_verified: {type: Boolean},
    phone: {type: String},
    role: {
        ref: "RoleSchema",
        type: String
    },
    price: {type: String},
    six_digit_code: {type: String}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('UserSchema', userSchema);