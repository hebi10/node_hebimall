import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoriesFilePath = path.join(__dirname, '../data/categories.json');

class CategoryModel {
    static async getAllCategories() {
        const categoriesData = await fs.readFile(categoriesFilePath, 'utf8');
        return JSON.parse(categoriesData);
    }

    static async saveAllCategories(categories) {
        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), 'utf8');
    }

    static async findById(id) {
        const categories = await this.getAllCategories();
        return categories.find(category => category._id === id);
    }

    static async createCategory(categoryData) {
        const categories = await this.getAllCategories();
        categories.push(categoryData);
        await this.saveAllCategories(categories);
        return categoryData;
    }

    static async updateCategory(id, updatedData) {
        const categories = await this.getAllCategories();
        const categoryIndex = categories.findIndex(category => category._id === id);
        if (categoryIndex !== -1) {
            categories[categoryIndex] = { ...categories[categoryIndex], ...updatedData };
            await this.saveAllCategories(categories);
            return categories[categoryIndex];
        }
        return null;
    }

    static async deleteCategory(id) {
        const categories = await this.getAllCategories();
        const categoryIndex = categories.findIndex(category => category._id === id);
        if (categoryIndex !== -1) {
            const deletedCategory = categories.splice(categoryIndex, 1);
            await this.saveAllCategories(categories);
            return deletedCategory[0];
        }
        return null;
    }
}

export default CategoryModel;
