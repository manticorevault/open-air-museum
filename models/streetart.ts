const mongoose = require("mongoose");
export{mongoose}
const Schema = mongoose.Schema; 

const StreetArtSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String
});

module.exports = mongoose.model("StreetArt", StreetArtSchema);