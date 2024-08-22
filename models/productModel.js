import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imgUrl: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

class ProductModel {
    static async getAllProducts() {
        return await Product.find(); // 모든 제품을 가져옵니다.
    }

    static async findById(id) {
        return await Product.findById(id); // ID로 제품을 검색합니다.
    }

    static async createProduct(productData) {
        const product = new Product(productData);
        return await product.save(); // 새로운 제품을 생성하고 저장합니다.
    }

    static async updateProduct(id, updatedData) {
        return await Product.findByIdAndUpdate(id, updatedData, { new: true }); // 제품 정보를 업데이트합니다.
    }

    static async deleteProduct(id) {
        return await Product.findByIdAndDelete(id); // 제품을 삭제합니다.
    }
}

export default ProductModel;
