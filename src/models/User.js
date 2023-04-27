const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (value) => dayjs(value).format("MM/DD/YY hh:mma"),
  },
  pokemon: {
    type: Object,
    default: [],
  },
  money: {
    type: Number,
    default: 0,
  },
  items: {
    type: [String],
    default: [],
  },
  badges: {
    type: [String],
    default: [],
  },
  pc: {
    type: Object,
    default: [],
  },
  gender: {
    type: Number,
    default: 0, // 0 is boy, 1 is girl
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
