import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const costSchema = new Schema({
    import: {type: Number},
    discount: {type: Number},
    delivery: {type: Number},
    total: {type: Number}
});

const addressSchema = new Schema({
    city: {type: String},
    zip_code: {type: String},
    street: {type: String},
    number: {type: String},
    indications: {type: String}
})

const orderProductSchema = new Schema({
    product_id: {type: String},
    quantity: {type: Number},
    total: {type: Number}
})

const orderSchema = new Schema({
    user_id: {type: String},
    number: {type: Number},
    created_at: {type: String, required: false},
    products: [orderProductSchema],
    address: addressSchema,
    cost: costSchema,
    payment: {type: String, required: false},
    status: {type: String},
    status_payment: {type: String},
    payment_id: {type: String},
});

orderSchema.plugin(uniqueValidator);
module.exports = mongoose.model('OrderSchema', orderSchema)
