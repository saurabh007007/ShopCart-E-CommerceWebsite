const Category = require("../models/category.model")
const categoryData = require("../category.json")
const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")
const {ApiResponse} = require("../utils/ApiResponse")

const fetchAllCategories = asyncHandler(async(req,res,next)=>{
    // try{    
        const categories = await Category.find()
        return res.status(200).json(new ApiResponse(200,"Successfully fetched Categories", categories))
        // return res.status(200).json({success:true , data:categories , message:"Successfully fetched Categories"})
    // }catch(error){
    //     console.log({error})
    //     return res.status(500).json({success:false , message: "Something went wrong ", error:error.message})
    // }
})


const seedCategory = async(req,res)=>{
    try{
        await Category.create(categoryData)
    }catch(err){
        console.log({err})
        return res.status(500).json({success:false , message : "Something went wrong "})
    }
}

module.exports= {
    fetchAllCategories,
    seedCategory
}