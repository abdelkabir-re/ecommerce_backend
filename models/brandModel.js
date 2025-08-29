const mongoose = require("mongoose");

//1 create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
//findOne,findAll,Update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
//save
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

//2 create model
module.exports = mongoose.model("Brand", brandSchema);
