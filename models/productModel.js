const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: [true, "product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      require: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "Product price is required"],
      trim: true,
      max: [20000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      require: [true, "Product image cover is required"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
//Mongoose Midelware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      console.log(image);
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      console.log(imageUrl);
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
//findOne,findAll,Update
//.post() = بعد العملية → ينفع نستخدم النتيجة (document) لكن ما نغيرهاش وما نوقفش العملية.
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
//save
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
