import OrderSchema from '../../models/OrderSchema';
import Product from '../entities/Product';
import ProductSchema from '../../models/ProductSchema';

export default class Order {

    static async create(userId) {
        let orders = await OrderSchema.find({
            user_id: userId,
            status: "Pendient"
        });

        let number;
        if (orders.length == 0) number = 1;
        else number = orders[0].number + 1;

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

    // static async updatePendient(body) {
    //     await ProductSchema.updateOne({
    //         status: "Pendient"
    //     }, body);
    // }

    async _getOrderUpdatedByCost(userId, orderProduct) {
        const searchField = {
            user_id: userId,
            status: "Pendient"
        }

        const { price, stock } = await Product.findById(orderProduct.product_id);
        const order = await OrderSchema.find(searchField);
    
        if (orderProduct.quantity > stock) throw new Error("Insuficient stock");
        
        orderProduct.total = orderProduct.quantity * price;
        const cost = order[0].cost;
    
        cost.import = cost.import + (price * orderProduct.quantity);
        cost.total = cost.import - cost.discount + cost.delivery;
        
        if (cost.import < 0) {
            cost.total = cost.delivery;
            cost.import = 0;
        }

        order[0].cost = cost;

        return order[0];
    }

    static async addProduct(userId, orderProduct) {
        const { cost, products } = this._getOrderUpdatedByCost(userId, orderProduct);
    
        let ok = false; 
        for (let i=0; i < products.length; i++) {
            if (products[i].product_id != orderProduct.product_id) continue;
    
            products[i].quantity = products[i].quantity + orderProduct.quantity;
            ok = true;
            break;
        }
    
        if (!ok) products.push(orderProduct);
        
        await ProductSchema.updateOne({ _id: orderProduct.product_id }, {
            stock: stock - orderProduct.quantity
        });
    
        await OrderSchema.updateOne(searchField, {
            products,
            cost
        });
        
        const orders = await OrderSchema.find(searchField);
        const orders_updated = await utils.getProductsById(orders);
        
        return orders_updated[0];
    }

}