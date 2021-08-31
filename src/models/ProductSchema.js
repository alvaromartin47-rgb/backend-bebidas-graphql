import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {type: String},
    description: {type: String},
    stock: {type: Number},
    visible: {type: Boolean},
    photo: {type: String},
    max_order: {type: Number},
    discount: {type: Number},
    promotion: {type: Boolean}
});

module.exports = mongoose.model('ProductSchema', productSchema);