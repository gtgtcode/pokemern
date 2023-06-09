const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  types: {
    type: [String],
    required: true,
  },
  sprites: {
    type: [String],
    required: true,
  },
  level: {
    type: Number,
    required: true,
    default: 5,
  },
  xp: {
    type: Number,
    required: true,
    default: 0,
  },
  max_xp: {
    type: Number,
    required: true,
    default: 0,
  },
  health: {
    type: Number,
    required: true,
  },
  max_health: {
    type: Number,
    required: true,
  },
  moveset: {
    type: Object,
    required: true,
    maxlength: 4,
  },
  fullMoveset: {
    type: Object,
    required: true,
  },
  attack: {
    type: Number,
    required: true,
  },
  defense: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
});

module.exports =
  mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);
