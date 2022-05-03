const mongoose = require("mongoose");
export{mongoose}
const Schema = mongoose.Schema; 

const StreetArtSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("StreetArt", StreetArtSchema);