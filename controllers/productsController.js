const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/products.json');

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Failed to read file');
    }
}

async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
    } catch (err) {
        throw new Error('Failed to write file');
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await readFile(DATA_FILE_PATH);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
        const products = await readFile(DATA_FILE_PATH);
        const product = products.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    const { name, description, price, imgUrl, category } = req.body;

    try {
        const products = await readFile(DATA_FILE_PATH);
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name,
            description,
            price,
            imgUrl,
            category,
            createdAt: new Date()
        };

        products.push(newProduct);
        await writeFile(DATA_FILE_PATH, products);

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, imgUrl, category } = req.body;

    try {
        const products = await readFile(DATA_FILE_PATH);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        products[productIndex].name = name;
        products[productIndex].description = description;
        products[productIndex].price = price;
        products[productIndex].imgUrl = imgUrl;
        products[productIndex].category = category;
        products[productIndex].updatedAt = new Date();

        await writeFile(DATA_FILE_PATH, products);

        res.json(products[productIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
        let products = await readFile(DATA_FILE_PATH);
        products = products.filter(p => p.id !== productId);

        await writeFile(DATA_FILE_PATH, products);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
