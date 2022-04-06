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

// Parse the req body
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("home")
});

app.get("/street-arts", async (req: any, res: { render: (arg0: any, arg1: any) => void; }) => {
    const streetarts = await (StreetArt.find({}))

    res.render("streetarts/index", {streetarts})
});

app.get("/street-arts/create", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("streetarts/new")
});

app.post("/street-arts", async(req: { body: { streetart: any; }; }, res: { send: (arg0: any) => any; redirect: (arg0: string) => void; }) => {
    const streetArt = new StreetArt(req.body.streetart);

    await streetArt.save();
    res.redirect(`/street-arts/${streetArt._id}`)
});

app.get("/street-arts/:id", async (req: any, res: { render: (arg0: string, arg1: any) => void; }) => {
    const streetart = await StreetArt.findById(req.params.id)
    res.render("streetarts/show", { streetart })
});

app.listen(3000, () => {
    console.log("Server up on port 3000! 🚀")
})