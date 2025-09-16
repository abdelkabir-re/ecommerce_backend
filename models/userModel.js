const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email required"],
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "to short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: String,
      default: true,
    },
    //Child Reference =  (products)يعرف أولاده(user)الأب
    wishList:[{
      type:mongoose.Schema.ObjectId,
      ref:"Product"
    }],
    addresses:[
      {
        id:{type:mongoose.Schema.Types.ObjectId},
        alias:String,
        details:String,
        phone:String,
        city:String,
        postalCode:String
      }
      
    ]
  },

  { timestamps: true }
);

//.pre() = قبل العملية → ينفع نعدّل البيانات أو نوقف العملية
//When you create a new user with .save() or Model.create(), this middleware runs, and the password will be hashed.
//findByIdAndUpdate bypasses .save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
