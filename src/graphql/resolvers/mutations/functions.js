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
    await User.deleteAllOrders();
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

async function processAddProductOrder(input, accessToken) {
    const { id } = Token.decode(accessToken);

    return await Order.addProduct(id, input);
}

async function processFinalizeOrder(input, accessToken) {
    const { id } = Token.decode(accessToken);

    if (input.payment == "mercado-pago") {
        const preferenceId = await Order.collect(id, input);
        
        return {
            preference_id: preferenceId,
            message: "Payment must be processed"
        };
    }

    return await Order.finalize(id, {
        address: input.address,
        payment: input.payment,
        created_at: moment().unix(),
        status_payment: "pending",
        status: "En preparación",
    });
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

async function processValidatePayment(resultTransaction, accessToken) {
    const { order_id, address, payment } = Token.decode(accessToken);
    const { user_id, status } = await Order.findById(order_id);
    
    if (status == "En preparación") {
        throw new Error("");
    }
    
    return await Order.finalize(user_id, {
        address,
        payment,
        created_at: moment().unix(),
        payment_id: resultTransaction.payment_id,
        status_payment: resultTransaction.status,
        status: "En preparación",
    });
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
    processDeleteOrder,
    processValidatePayment
}