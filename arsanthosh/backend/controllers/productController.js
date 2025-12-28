const productService = require("../services/productService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const getAllProducts = catchAsync(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    return ApiResponse.success(res, 200, result.products, "Products fetched successfully", {
        total: result.total,
        pages: result.pages,
        currentPage: result.currentPage
    });
});

const getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    return ApiResponse.success(res, 200, product);
});

const createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body, req.user?.id);
    return ApiResponse.success(res, 201, product);
});

const getProductBySlug = catchAsync(async (req, res) => {
    const product = await productService.getProductBySlug(req.params.slug);
    return ApiResponse.success(res, 200, product);
});

const updateProduct = catchAsync(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    return ApiResponse.success(res, 200, product);
});

const deleteProduct = catchAsync(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    return ApiResponse.success(res, 200, result);
});

const updateStock = catchAsync(async (req, res) => {
    const { stock } = req.body;
    const result = await productService.updateStock(req.params.id, stock, req.user?.id);
    return ApiResponse.success(res, 200, result);
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    updateStock
};
