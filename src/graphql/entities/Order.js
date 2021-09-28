import OrderSchema from '../../models/OrderSchema';
import Product from '../entities/Product';
import Payment from '../entities/Payment';
import ProductSchema from '../../models/ProductSchema';
import utils from '../../graphql/resolvers/utils';
import moment from 'moment';

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
            status: "Pendient",
            status_payment: null
        });

        await newOrderSchema.save();
    }

    // static async updatePendient(body) {
    //     await ProductSchema.updateOne({
    //         status: "Pendient"
    //     }, body);
    // }

    static async _updateOrderByCost(order, product, orderProduct) {
        const price = product.price;
        const stock = product.stock;
        
        if (orderProduct.quantity > stock) throw new Error("Insuficient stock");
        
        orderProduct.total = orderProduct.quantity * price;
        const cost = order.cost;
    
        cost.import = cost.import + (price * orderProduct.quantity);
        cost.total = cost.import - cost.discount + cost.delivery;
        
        if (cost.import < 0) {
            cost.total = cost.delivery;
            cost.import = 0;
        }

        order.cost = cost;
    }

    static _verifyExistProductInOrder(products, orderProduct) {
        let ok = false; 
        for (let i=0; i < products.length; i++) {
            if (products[i].product_id != orderProduct.product_id) continue;
    
            products[i].quantity = products[i].quantity + orderProduct.quantity;
            ok = true;
            break;
        }
    
        if (!ok) products.push(orderProduct);
    }

    static async getOrderPendient(userId) {
        const searchField = {
            user_id: userId,
            status: "Pendient"
        }
    
        const orders = await OrderSchema.find(searchField);
        
        return orders[0];
    }

    static async addProduct(userId, orderProduct) {
        const order = await Order.getOrderPendient(userId);
        const product = await Product.findById(orderProduct.product_id);
        const stock = product.stock;
        
        await Order._updateOrderByCost(
            order,
            product,
            orderProduct
        );
        
        Order._verifyExistProductInOrder(order.products, orderProduct);
        
        await ProductSchema.updateOne({ _id: orderProduct.product_id }, {
            stock: stock - orderProduct.quantity
        });
    
        await Order.update(userId, {
            products: order.products,
            cost: order.cost
        });
        
        const orders = await Order.getOrderPendient(userId);
        const orders_updated = await utils.getProductsById([orders]);
        
        return orders_updated[0];
    }

    static async finalize(userId, input) {
        const order = await Order.getOrderPendient(userId);
        
        if (order.products.length == 0) {
            throw new Error("You must add at least one product");
        }
        
        await Order.create(userId);
    
        await Order.update(userId, {
            status: "In preparation",
            created_at: moment().unix(),
            address: input.address,
            payment: input.payment
        });
    
        return {message: "Order in preparation"};
    }

    static async update(userId, fields) {
        const searchField = {
            user_id: userId,
            status: "Pendient"
        }

        await OrderSchema.updateOne(searchField, fields);
    }

    static async collect(userId) {
        const order = await Order.getOrderPendient(userId);

        if (!order.status_payment) {
            await Order.update(userId, {status_payment: "pending"});

            const payment = new Payment(
                process.env.PUBLIC_KEY_MP,
                process.env.ACCESS_TOKEN_MP
            );
            
            return payment.createPreference({
                title: "Pago online",
                unit_price: Number(order.cost.total),
                quantity: Number(1)
            }, order._id);
        }

        throw new Error("You must validate transaction");
    }

    static async validatePayment(orderId, resultTransaction) {
        const order = OrderSchema.findById(orderId);

        if (!order.status_payment || order.status_payment == "success") {
            throw new Error("Validate payment requires status payment pending");
        }

        if (resultTransaction.status_payment == "failure") {
            await Order.update({status_payment: null});
        }

        else if (resultTransaction.status_payment == "success") {
            await Order.update({status_payment: "paid out"});
        }

        else throw new Error("Result must be success or failure");

        const payment = new Payment(process.env.PUBLIC_KEY_MP, process.env.ACCESS_TOKEN_MP);
        
        return payment.validate(resultTransaction);
    }

}