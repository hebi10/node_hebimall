const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductModel {
    constructor(id, name, description, price, imgUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgUrl = imgUrl;
    }

    static getAllProducts() {
        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(productsData);
    }

    static saveAllProducts(products) {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    }

    static findById(id) {
        const products = this.getAllProducts();
        return products.find(product => product.id === id);
    }

    static createProduct(productData) {
        const products = this.getAllProducts();
        products.push(productData);
        this.saveAllProducts(products);
        return productData;
    }

    static updateProduct(id, updatedData) {
        const products = this.getAllProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedData };
            this.saveAllProducts(products);
            return products[productIndex];
        }
        return null;
    }

    static deleteProduct(id) {
        const products = this.getAllProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = products.splice(productIndex, 1);
            this.saveAllProducts(products);
            return deletedProduct[0];
        }
        return null;
    }
}

module.exports = ProductModel;
