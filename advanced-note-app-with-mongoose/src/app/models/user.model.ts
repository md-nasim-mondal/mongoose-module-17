import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import type {
  IAddress,
  IUser,
  UserInstanceMethods,
  UserStaticsMethods,
} from "../interfaces/user.interface";
import validator from "validator";
import type { Model } from "mongoose";
import { Note } from "./notes.model";

const addressSchema = new Schema<IAddress>(
  {
    city: { type: String },
    street: { type: String },
    zip: { type: Number },
  },
  {
    _id: false,
  }
);

const userSchema = new Schema<IUser, UserStaticsMethods, UserInstanceMethods>(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required!!"],
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: { type: String, required: true, trim: true },
    age: {
      type: Number,
      required: true,
      // min: [18, "Age Must be at least 18, got {VALUE}"],
      min: 18,
      max: 60,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, "This email already used!!"],
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[^\s@]+\.[^\s@]+$/.test(v);
      //   },
      //   message: function(props) {
      //     return `Email ${props?.value} is not valid email!`
      //   }
      // },
      validate: [validator.isEmail, "Invalid Email Sent {VALUE}!"],
    },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      // enum: ["user", "admin"],
      enum: {
        values: ["user", "admin"],
        message: "Role is not valid! got {VALUE} role",
      },
      default: "user",
    },
    address: {
      type: addressSchema,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.method("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

userSchema.static("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

// Pre Hooks

// Document Middleware

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Query Middleware

userSchema.pre("find", function (next) {
  next();
});

// Post Hooks

// Document Middleware
userSchema.post("save", async function (doc, next) {
  console.log("%s has been saved", doc?._id);
  next();
});

// Query Middleware
userSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Note.deleteMany({ user: doc._id });
    next();
  }
});

export const User = model<IUser, UserStaticsMethods>("User", userSchema);
