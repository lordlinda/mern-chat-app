const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
