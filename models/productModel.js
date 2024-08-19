import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductModel {
    static async getAllProducts() {
        const productsData = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(productsData);
    }

    static async saveAllProducts(products) {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    }

    static async findById(id) {
        const products = await this.getAllProducts();
        return products.find(product => product._id === id);
    }

    static async createProduct(productData) {
        const products = await this.getAllProducts();
        products.push(productData);
        await this.saveAllProducts(products);
        return productData;
    }

    static async updateProduct(id, updatedData) {
        const products = await this.getAllProducts();
        const productIndex = products.findIndex(product => product._id === id);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedData };
            await this.saveAllProducts(products);
            return products[productIndex];
        }
        return null;
    }

    static async deleteProduct(id) {
        const products = await this.getAllProducts();
        const productIndex = products.findIndex(product => product._id === id);
        if (productIndex !== -1) {
            const deletedProduct = products.splice(productIndex, 1);
            await this.saveAllProducts(products);
            return deletedProduct[0];
        }
        return null;
    }
}

export default ProductModel;
