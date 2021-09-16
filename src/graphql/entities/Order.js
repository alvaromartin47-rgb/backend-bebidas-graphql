import OrderSchema from '../../models/OrderSchema';

export default class Order {

    static async create(userId) {
        let orders = await OrderSchema.find({
            user_id: userId,
            status: "Pendient"
        });

        let number = orders[0].number;

        if (!number) number = 1;
        else number = number + 1;

        const newOrderSchema = new OrderSchema({
            user_id: userId,
            number,
            cost: {
                import: 0.0,
                discount: 0.0,
                delivery: 50.0,
                total: 50.0
            },
            products: [],
            status: "Pendient"
        });
        
        await newOrderSchema.save();
    }

    static async updatePendient(body) {
        await ProductSchema.updateOne({
            status: "Pendient"
        }, body);
    }

}