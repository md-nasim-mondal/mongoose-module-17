import { model, Schema } from "mongoose";
import type { IUser } from "../interfaces/user.interface";
import validator from "validator"

const userSchema = new Schema<IUser>({
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
    validate:[validator.isEmail, "Invalid Email Sent {VALUE}!"]
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
});

export const User = model("User", userSchema);
