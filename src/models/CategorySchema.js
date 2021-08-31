import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {type: String, unique: true},
    products: [{
        ref: "ProductSchema",
        type: Schema.Types.ObjectId,
    }],
    sub_categories: [{
        ref: "CategorySchema",
        type: Schema.Types.ObjectId
    }]
});

categorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('CategorySchema', categorySchema);