const Category = require('../models/category');

class CategoryRepository {
    async create(categoryData) {
        const existingCategory = await this.findByName(categoryData.name);
        if (existingCategory) {
            throw new Error('Category name already exists');
        }
        return await Category.create(categoryData);
    }

    async update(id, categoryData) {
        if (categoryData.name) {
            const existingCategory = await this.findByName(categoryData.name);
            if (existingCategory && existingCategory._id.toString() !== id) {
                throw new Error('Category name already exists');
            }
        }
        const category = await Category.findByIdAndUpdate(id, categoryData, {new: true});
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async delete(id) {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async findById(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async findAll(page = 1, size = 10, sortField = 'createdAt') {
        const skip = (page - 1) * size;

        const [data, total] = await Promise.all([
            Category.find().sort({[sortField]: 1}).skip(skip).limit(size),
            Category.countDocuments()
        ]);

        return {
            data,
            totalElements: total,
            totalPages: Math.ceil(total / size),
            currentPage: page,
            currentSize: size
        };
    }

    async findByName(name) {
        return await Category.findOne({name: new RegExp(`^${name}$`, 'i')});
    }
}

module.exports = new CategoryRepository();