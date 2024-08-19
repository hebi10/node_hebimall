import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ordersFilePath = path.join(__dirname, '../data/orders.json');

class OrderModel {
    static async getAllOrders() {
        const ordersData = await fs.readFile(ordersFilePath, 'utf8');
        return JSON.parse(ordersData);
    }

    static async saveAllOrders(orders) {
        await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    }

    static async findByUserId(userId) {
        const orders = await this.getAllOrders();
        return orders.filter(order => order.userId === userId);
    }

    static async createOrder(orderData) {
        const orders = await this.getAllOrders();
        orders.push(orderData);
        await this.saveAllOrders(orders);
        return orderData;
    }

    static async updateOrder(orderId, updatedData) {
        const orders = await this.getAllOrders();
        const orderIndex = orders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex] = { ...orders[orderIndex], ...updatedData };
            await this.saveAllOrders(orders);
            return orders[orderIndex];
        }
        return null;
    }
}

export default OrderModel;
