import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

class CategoryModel {
    static async getAllCategories() {
        return await Category.find();  // 모든 카테고리 데이터를 가져옵니다.
    }

    static async findById(id) {
        return await Category.findById(id);  // ID로 카테고리를 검색합니다.
    }

    static async createCategory(categoryData) {
        const category = new Category(categoryData);
        return await category.save();  // 새로운 카테고리를 생성하고 저장합니다.
    }

    static async updateCategory(id, updatedData) {
        return await Category.findByIdAndUpdate(id, updatedData, { new: true });  // 카테고리 정보를 업데이트합니다.
    }

    static async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);  // 카테고리를 삭제합니다.
    }
}

export default CategoryModel;
