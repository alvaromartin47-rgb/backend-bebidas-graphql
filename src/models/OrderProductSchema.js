import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderProductSchema = new Schema({
    product_id: {type: String},
    quantity: {type: Number},
});

module.exports = mongoose.model('OrderProductSchema', orderProductSchema)