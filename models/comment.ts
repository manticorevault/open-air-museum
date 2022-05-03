const mongoose = require("mongoose");
const Schema = mongoose.schema;

const commentSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model("Comment", commentSchema);