const fs = require('fs');
const path = require('path');

const categoriesFilePath = path.join(__dirname, '../data/categories.json');

class CategoryModel {
    static getAllCategories() {
        const categoriesData = fs.readFileSync(categoriesFilePath, 'utf8');
        return JSON.parse(categoriesData);
    }

    static saveAllCategories(categories) {
        fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2), 'utf8');
    }

    static findById(id) {
        const categories = this.getAllCategories();
        return categories.find(category => category.id === id);
    }

    static createCategory(categoryData) {
        const categories = this.getAllCategories();
        categories.push(categoryData);
        this.saveAllCategories(categories);
        return categoryData;
    }

    static updateCategory(id, updatedData) {
        const categories = this.getAllCategories();
        const categoryIndex = categories.findIndex(category => category.id === id);
        if (categoryIndex !== -1) {
            categories[categoryIndex] = { ...categories[categoryIndex], ...updatedData };
            this.saveAllCategories(categories);
            return categories[categoryIndex];
        }
        return null;
    }

    static deleteCategory(id) {
        const categories = this.getAllCategories();
        const categoryIndex = categories.findIndex(category => category.id === id);
        if (categoryIndex !== -1) {
            const deletedCategory = categories.splice(categoryIndex, 1);
            this.saveAllCategories(categories);
            return deletedCategory[0];
        }
        return null;
    }
}

module.exports = CategoryModel;
