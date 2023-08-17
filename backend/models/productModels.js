const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "please enter product price"],
    MaxLength: [8, "product price exceeds limit"],
  },
  ratings: {
    type: Number,
    default: 0
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter category"],
  },
  stock: {
    type: String,
    required: [true, "please enter stock"],
    MaxLength: [4, "stock exceeded"],
    default: 1,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: [true, "reviewer name is required"],
      },
      rating: {
        type: Number,
        required: true,
        default: 0,
      },
      comment: {
        type: String,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
