const mongoose = require("mongoose");

//1 create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// init → DB بعد الجلب من .

// validate → بعد التحقق من القيم، قبل الحفظ.

// save → DB بعد الحفظ في .

// deleteOne →DB بعد الحذف من

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//findOne,findAll,Update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
//save
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

//2 create model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
