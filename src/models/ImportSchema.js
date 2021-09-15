import mongoose from 'mongoose';

const { Schema } = mongoose;

const importSchema = new Schema({
    import: {type: Number},
    discount: {type: Number},
    delivery: {type: Number},
    total: {type: Number}
});

module.exports = mongoose.model('ImportSchema', importSchema)