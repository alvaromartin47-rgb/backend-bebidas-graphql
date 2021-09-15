import ProductSchema from '../../models/ProductSchema';

export default class Product {

    static async findById(productId) {
        const data = await ProductSchema.findById(productId);

        if (!data) throw new Error("Not exist product with this ID");
        return data;
    }

}