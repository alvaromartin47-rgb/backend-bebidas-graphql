import env from 'node-env-file';
import User from '../../entities/User';
import Password from '../../entities/Password';
import fcsQ from '../queries/functions';
import UserSchema from '../../../models/UserSchema';
import ProductSchema from '../../../models/ProductSchema';
import CategorySchema from '../../../models/CategorySchema';
import EmailRecovery from '../../entities/EmailRecovery';
import PasswordSchema from '../../../models/PasswordSchema';
import OrderSchema from '../../../models/OrderSchema';
import Sender from '../../entities/Sender';
import Token from '../../entities/Token';
import Order from '../../entities/Order';
import Product from '../../entities/Product';
import utils from '../utils';
import moment from 'moment';

env("src/.env");

async function getUser(email, password) {
    const { name, lastname } = await UserSchema.find({ email });

    return new User(name, lastname);
}

async function processSignIn(email, password) {
    const user = await getUser(email);

    return await user.login(email, password);
}

async function processSignUp(userSchema) {
    const email = userSchema.email;
    const password = userSchema.password;

    delete userSchema.email;
    delete userSchema.password;

    const user = new User(userSchema);

    return await user.register(email, password);
}

async function processSendEmailUpdatePassword(email) {
    const sender = new Sender(new EmailRecovery(email));
    return await sender.sendEmail();
}

async function processUpdatePassword(accessToken, new_pwd) {
    const { id } = Token.decode(accessToken);

    const password = new Password(new_pwd);

    await PasswordSchema.updateOne({ userId: id }, {
        hash: await password.encrypt()
    });

    return "Password updated";
}

async function processAddCategory(category) {
    const data = new CategorySchema(category);
    const { _id } = await data.save();

    return _id;
}

async function processAddProduct(product) {
    const data = new ProductSchema(product);
    const { _id } = await data.save();

    return _id;
}

async function processUpdateProfile(accessToken, newProfile) {
    const { id } = Token.decode(accessToken);

    await UserSchema.updateOne({ _id: id }, newProfile);

    return "Profile updated";
}

async function processDeleteUser(accessToken, password) {
    const { id } = Token.decode(accessToken);

    const pwd = new Password(password);
    await pwd.compareWithPasswordOf(id);

    await PasswordSchema.deleteOne({ userId: id });
    await UserSchema.deleteOne({ _id: id });

    await fcsQ.processLogout(accessToken);

    return "Deleted correctly";
}

async function processDeleteProduct(input) {
    await ProductSchema.deleteOne({ _id: input.product_id });

    return "Deleted correctly";
}

async function processUpdateProduct(input) {
    await ProductSchema.updateOne({
        _id: input.product_id
    }, input.data);

    return "Product updated";
}

// Refactorizar

async function processAddProductOrder(input, accessToken) {
    const { id } = Token.decode(accessToken);

    const searchField = {
        user_id: id,
        status: "Pendient"
    }

    const { price, stock } = await Product.findById(input.product_id);
    const data = await OrderSchema.find(searchField);

    if (input.quantity > stock) throw new Error("Insuficient stock");
    
    input.total = input.quantity * price;
    const cost = data[0].cost;
    const products = data[0].products;

    cost.import = cost.import + (price * input.quantity);
    cost.total = cost.import - cost.discount + cost.delivery;
    
    let ok = false; 
    for (let i=0; i < products.length; i++) {
        if (products[i].product_id != input.product_id) continue;

        products[i].quantity = products[i].quantity + input.quantity;
        ok = true;
        break;
    }

    if (!ok) products.push(input);
    
    await ProductSchema.updateOne({ _id: input.product_id }, {
        stock: stock - input.quantity
    });

    await OrderSchema.updateOne(searchField, {
        products,
        cost
    });
    
    const orders = await OrderSchema.find(searchField);
    const orders_updated = await utils.getProductsById(orders);
    
    return orders_updated[0];
}

async function processFinalizeOrder(input, accessToken) {
    const { id } = Token.decode(accessToken);

    const searchField = {
        user_id: id,
        status: "Pendient"
    }

    const orders = await OrderSchema.find(searchField);
    
    if (orders[0].products.length == 0) {
        throw new Error("You must add at least one product");
    }
    
    await Order.create(id);

    await OrderSchema.updateOne(searchField, {
        status: "In preparation",
        created_at: moment().unix(),
        address: input.address,
        payment: input.payment
    });

    return "Order in preparation";
}

async function processDeleteOrder(orderId) {
    const order = await OrderSchema.findById(orderId);

    if (!order) throw new Error("Order not exist");
    if (order.status != "In preparation") {
        throw new Error("Only delete order when is in preparation");
    }

    await OrderSchema.deleteOne({_id: orderId});

    return "Order deleted correctly";
}

module.exports = {
    processSignUp,
    processSignIn,
    processUpdatePassword,
    processAddCategory,
    processAddProduct,
    processUpdateProfile,
    processSendEmailUpdatePassword,
    processDeleteUser,
    processDeleteProduct,
    processUpdateProduct,
    processAddProductOrder,
    processFinalizeOrder,
    processDeleteOrder
}