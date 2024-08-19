import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartModel {
    static async getAllCarts() {
        const cartsData = await fs.readFile(cartsFilePath, 'utf8');
        return JSON.parse(cartsData);
    }

    static async saveAllCarts(carts) {
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
    }

    static async findByUserId(userId) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.userId === userId);
    }

    static async createCart(cartData) {
        const carts = await this.getAllCarts();
        carts.push(cartData);
        await this.saveAllCarts(carts);
        return cartData;
    }

    static async updateCart(userId, updatedData) {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.userId === userId);
        if (cartIndex !== -1) {
            carts[cartIndex] = { ...carts[cartIndex], ...updatedData };
            await this.saveAllCarts(carts);
            return carts[cartIndex];
        }
        return null;
    }

    static async deleteCart(userId) {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.userId === userId);
        if (cartIndex !== -1) {
            const deletedCart = carts.splice(cartIndex, 1);
            await this.saveAllCarts(carts);
            return deletedCart[0];
        }
        return null;
    }
}

export default CartModel;
