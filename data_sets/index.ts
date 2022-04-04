export {}
const mongoose = require("mongoose");
const StreetArt = require("../models/streetart");

const dotenv = require("dotenv")
dotenv.config();

const connectionString = `mongodb+srv://${ process.env.MONGODB_USER }:${ process.env.MONGODB_PASS }@${ process.env.MONGODB_CONFIG }`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Database is now connected");
});

const seedDB = async () => {
    await StreetArt.deleteMany({});
    const art = new StreetArt({ title: "Glancing Woman" });

    await art.save();
};

seedDB();