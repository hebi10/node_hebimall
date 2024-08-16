const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartModel {
    static getAllCarts() {
        const cartsData = fs.readFileSync(cartsFilePath, 'utf8');
        return JSON.parse(cartsData);
    }

    static saveAllCarts(carts) {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
    }

    static findByUserId(userId) {
        const carts = this.getAllCarts();
        return carts.find(cart => cart.userId === userId);
    }

    static createCart(cartData) {
        const carts = this.getAllCarts();
        carts.push(cartData);
        this.saveAllCarts(carts);
        return cartData;
    }

    static updateCart(userId, updatedData) {
        const carts = this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.userId === userId);
        if (cartIndex !== -1) {
            carts[cartIndex] = { ...carts[cartIndex], ...updatedData };
            this.saveAllCarts(carts);
            return carts[cartIndex];
        }
        return null;
    }

    static deleteCart(userId) {
        const carts = this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.userId === userId);
        if (cartIndex !== -1) {
            const deletedCart = carts.splice(cartIndex, 1);
            this.saveAllCarts(carts);
            return deletedCart[0];
        }
        return null;
    }
}

module.exports = CartModel;
