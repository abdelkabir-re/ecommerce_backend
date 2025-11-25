const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new moongose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
      required: true,
    },
    user: {
      type: moongose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    //Parent Reference = (product)يعرف أبوه(review)لولد
    product: {
      type: moongose.Schema.ObjectId,
      ref: "Prdouct",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

// we created calcAverageRatingsAndQuantity function for Review model =>Review.calcAverageRatingsAndQuantity
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    const product1 = await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
    console.log(product1);
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
//here this.constructor=Review
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post("findOneAndDelete", async (doc) => {
  await mongoose.models.Review.calcAverageRatingsAndQuantity(doc.product);
});

module.exports = mongoose.model("Review", reviewSchema);
