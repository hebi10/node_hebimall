const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');

class OrderModel {
    static getAllOrders() {
        const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
        return JSON.parse(ordersData);
    }

    static saveAllOrders(orders) {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    }

    static findByUserId(userId) {
        const orders = this.getAllOrders();
        return orders.filter(order => order.userId === userId);
    }

    static createOrder(orderData) {
        const orders = this.getAllOrders();
        orders.push(orderData);
        this.saveAllOrders(orders);
        return orderData;
    }

    static updateOrder(orderId, updatedData) {
        const orders = this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex] = { ...orders[orderIndex], ...updatedData };
            this.saveAllOrders(orders);
            return orders[orderIndex];
        }
        return null;
    }
}

module.exports = OrderModel;
