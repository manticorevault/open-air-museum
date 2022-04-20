import { arrayBuffer } from "stream/consumers";

export {}
const mongoose = require("mongoose");
const StreetArt = require("../models/streetart");
// import the cities array from cities.ts
const cities = require("./cities");
// import the descriptors and places to generate streetart names
const { places, descriptors } = require("./helpers");

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

const sampleArt = (array: string | any[]) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await StreetArt.deleteMany({});

    // Generate 15 different street art entries
    for (let index = 0; index < 15; index++) {
        const number = Math.floor(Math.random() * 1000)
        const art = new StreetArt({
            location: `${ cities[number].city }`,
            title: `${ sampleArt(descriptors) } ${ sampleArt(places) }`,
            image: "https://source.unsplash.com/collection/9622459",
            author: "Banksy",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        });

        await art.save();
    }
};

seedDB();

