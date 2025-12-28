const Product = require("../models/Product");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");

const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

const getAllProducts = async (reqQuery) => {
    let query = {};
    const { category, minPrice, maxPrice, isFeatured, search, page = 1, limit = 10, status } = reqQuery;

    if (category) query.category = category;
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (status && status !== "all") query.status = status;
    else if (!status) query.status = "published";

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Product.countDocuments(query);

    return {
        products,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum
    };
};

const getProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new AppError("Product not found", 404);

    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });

    return {
        ...product._doc,
        reviews
    };
};

const createProduct = async (productData, adminId) => {
    const { name } = productData;
    const slug = generateSlug(name);

    const product = await Product.create({
        ...productData,
        slug
    });

    await activityService.logActivity("PRODUCT", `New product added: ${product.name}`, {
        adminId,
        targetTab: "products",
        targetId: product._id
    });

    return product;
};

const getProductBySlug = async (slug) => {
    const product = await Product.findOne({ slug, status: "published" });
    if (!product) throw new AppError("Product not found", 404);

    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });

    return {
        ...product._doc,
        reviews
    };
};

const updateProduct = async (id, productData) => {
    if (productData.name) {
        productData.slug = generateSlug(productData.name);
    }

    const product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true
    });

    if (!product) throw new AppError("Product not found", 404);

    return product;
};

const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new AppError("Product not found", 404);

    await Review.deleteMany({ productId: product._id });

    return { message: "Product and associated reviews deleted" };
};

const updateStock = async (id, stock, adminId) => {
    const product = await Product.findByIdAndUpdate(
        id,
        { stock },
        { new: true }
    );

    if (!product) throw new AppError("Product not found", 404);

    await activityService.logActivity("PRODUCT", `Inventory updated for ${product.name}: ${stock} items in stock`, {
        adminId,
        targetTab: "products",
        targetId: product._id
    });

    return { stock: product.stock };
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    updateStock
};
