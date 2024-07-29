const productsData = require("../products.json");
const Product = require("../models/product.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const seedData = async () => {
  try {
    await Product.create(productsData);
  } catch (err) {
    console.log({ err });
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong " });
  }
};

const updateProduct = asyncHandler(async(req,res,next)=>{
  // try {
    // console.log('id',req.params)
    const { productId } = req.params;
    if(!productId){
      return next(new ApiError(400,"Product Id not passed"))
    }
    console.log({productId})
    const {fieldsToBeUpdated} = req.body
    if(!fieldsToBeUpdated){
      return next(new ApiError(400,"No fields found"))
    }

    console.log({productId,fieldsToBeUpdated})
  
    const productToBeUpdated = await Product.findByIdAndUpdate(productId, {...fieldsToBeUpdated} , {new:true})
    console.log({productToBeUpdated})

    return res.status(200).json(new ApiResponse(200,"Updated Successfully"))
    // return res.status(200).json({success:true , message:"Updated Successfully"})
  // } catch (error) {
  //   console.log({error})
  //   return res.status(500).json({success:false , message :"Something went wrong", error:error.message})
  // }
  
})

const fetchProductById = asyncHandler(async (req, res,next) => {
  
    const { productId } = req.params;
    if(!productId){
      return next(new ApiError(400,"Product Id not passed"))
    }
    const product = await Product.findOne({ _id: productId });

    return res.status(200).json(new ApiResponse(200,"Fetched successfully", product))
    // return res.status(200).json({ success: true, data: product });
  
    
});

const fetchAllProducts = asyncHandler(async (req, res,next) => {
  // try {
    console.log(req.query);
    
    let query = Product.find();
    let totalProductsQuery = Product.find();

    if (req.query.category) {
      query = query.find({ category: { $in: req.query.category } });
      totalProductsQuery = totalProductsQuery.find({
        category: { $in: req.query.category },
      });
    }

    if (req.query.brand) {
      query = query.find({ brand: { $in: req.query.brand } });
      totalProductsQuery = totalProductsQuery.find({
        brand: { $in: req.query.brand },
      });
    }

    if (req.body.search.trim() !== "") {
      query = query.find({
        title: { $regex: ".*" + req.body.search + ".*", $options: "i" },
      });
      totalProductsQuery = totalProductsQuery.find({
        title: { $regex: ".*" + req.body.search + ".*", $options: "i" },
      });
    }

    const sortField = req.query._sort;
    console.log({ sortField });
    const sortOrder = parseInt(req.query._order, 10) || 1;

    // Regular sorting by the specified field
    if (sortField) {
      query = query.sort({ [sortField]: sortOrder });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const totalDocs = await totalProductsQuery.countDocuments();
    const products = await query.exec();

    // console.log({ products, totalDocs });

    return res.status(200).json(new ApiResponse(200,"Fetched successfully", { totalProducts: totalDocs, products }))
    // return res
    //   .status(200)
      // .json({ success: true, data: { totalProducts: totalDocs, products } });
  // } catch (err) {
  //   console.log({ err });
  //   return res.status(500).json({ success: false, message: err.message });
  // }
})

const createProduct = asyncHandler(async(req,res,next)=>{
  // try{
    const {product} = req.body
    if(!product){
      return next(new ApiError(400,"Product details not passed"))
    }
    // if(!title || ! ....)
    console.log({product})

    const newProduct = await Product.create({...product})
    console.log({newProduct})

    return res.status(200).json(new ApiResponse(200,"Added successfully"))
    // return res.status(200).json({success:true , message: "Added successfully" })

  // }catch(error){
  //   return res.status(500).json({success:false , message:"Something went wrong" , error:error.message})
  // }
})

module.exports = {
  seedData,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
  createProduct
};