const productSchema = require("../models/productModels");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// create product
exports.createProducts = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else{
      images = req.body.images;
    }
    
    if(!images){
      return res.status(400).json({error: "atleast one image required!"})
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  

    req.body.images = imagesLinks;

    req.body.user = req.User.id;

    const product = await productSchema.create(req.body);

    res.status(200).json({
      message: "product created",
      data: product,
      success: true
    });
  } catch (error) {
    return next(new ErrorHandler(error, 404));
  }
};

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 8;
    const productsCount = await productSchema.countDocuments();

    const apiFeatures = new ApiFeatures(productSchema.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    const products = await apiFeatures.query;
    res.status(200).json({
      message: "all products displayed succesfully",
      products,
      productsCount,
      resultPerPage,
    });
  } catch (error) {
    res.json(error.message);
  }
};

// get All Product (Admin)
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await productSchema.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(new ErrorHandler(400, error));
  }
};

// get product details
exports.productDetails = async (req, res, next) => {
  try {
    const product = await productSchema.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
      message: "product found",
      product,
    });
  } catch (error) {
    res.status(500).json(error.message);
    return next(new ErrorHandler("product not found", 404));
  }
};

// update products
exports.updateProducts = async (req, res) => {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
      // Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }

    product = await productSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      message: "product updated",
      data: product,
      success: true
    });
  } catch (error) {
    return next(new ErrorHandler(400, error))
    res.send(error.message);
  }
};

// delete products
exports.deleteProducts = async (req, res, next) => {
  try {
    const product = await productSchema.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "product deleted",
    });
  } catch (error) {
    res.json(error.message);
  }
};

// create/update reviews
exports.createReviews = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.User._id,
      name: req.User.name,
      rating: Number(rating),
      comment,
    };

    const product = await productSchema.findById(productId);

    if (!product) {
      next(new ErrorHandler(`product not found`));
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.User._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.User._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(review),
        (product.numberOfReviews = product.reviews.length);
    }

    let avg = 0,
      result = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    result = avg / product.reviews.length;

    product.ratings = result;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    product = await productSchema.findById(req.query.id);

    if (!product) {
      next(new ErrorHandler("product not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "all reviews displayed",
      data: product.reviews,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const product = await productSchema.findById(req.query.productId);

    if (!product) {
      next(new ErrorHandler("product not found", 400));
    }

    const reviews = product.reviews.filter(
      // (rev) => rev._id.toString() !== req.query.id.toString(),
      (rev) => console.log(rev._id.toString(), req.query.id.toString())
    );
   
    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numberOfReviews = reviews.length;

    await productSchema.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numberOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );


    res.status(200).json({
      success: true,
      message: "review deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
