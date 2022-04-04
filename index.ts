const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const StreetArt = require("./models/streetart");

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

const app = express();

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("home")
});

app.get("/add-art", async (req: any, res: { send: (arg0: any) => void; }) => {
    const streetArt = new StreetArt({
        title: "Emoboy",
        description: "Remember you emoboy next to the river."
    });

    await streetArt.save();

    res.send(streetArt);
});

app.listen(3000, () => {
    console.log("Server up on port 3000! 🚀")
})