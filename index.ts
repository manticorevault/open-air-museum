const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const { streetartSchema }  = require("./schemas")
const methodOverride = require("method-override");
const catchAsync = require("./helpers/catchAsync");
const Comment = require("./models/comment")

// Imports the ExpressError helper, and fixing the error with ES Module convertion
const ExpressError = require("./helpers/ExpressError");
export {}

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

app.engine("ejs", engine);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Parse the req body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateStreetArt = (req: { body: any; }, res: any, next: () => void) => {
    // Validate the streetartSchema with Joi.
    const { error } = streetartSchema.validate(req.body);

    if(error) {
        const message = error.details.map((element: { message: any; }) => element.message).join(",")

        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

app.get("/", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("home")
});

app.get("/street-arts", catchAsync(async (req: any, res: { render: (arg0: any, arg1: any) => void; }) => {
    const streetarts = await (StreetArt.find({}))

    res.render("streetarts/index", {streetarts})
}));

app.get("/street-arts/create", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("streetarts/new")
});

app.post("/street-arts", validateStreetArt, catchAsync (async(req: { body: { streetart: any; }; }, res: { redirect: (arg0: string) => void; }, next: (arg0: any) => void) => {

    const streetArt = new StreetArt(req.body.streetart);

    await streetArt.save();
    res.redirect(`/street-arts/${streetArt._id}`)

}));

app.get("/street-arts/:id", catchAsync(async (req: any, res: { render: (arg0: string, arg1: any) => void; }) => {
    const streetart = await StreetArt.findById(req.params.id)
    res.render("streetarts/show", { streetart })
}));

app.get("/street-arts/:id/edit", catchAsync(async(req: { params: { id: any; }; }, res: { render: (arg0: string, arg1: { streetart: any; }) => void; }) => {
    const streetart = await StreetArt.findById(req.params.id)
    res.render("streetarts/edit", { streetart })
}));

app.put("/street-arts/:id", validateStreetArt, catchAsync(async (req: { params: { id: any; }; body: { streetart: any; }; }, res: { redirect: (arg0: string) => void; }) => {
    const { id } = req.params;
    const streetart = await StreetArt.findByIdAndUpdate(id, {...req.body.streetart})

    res.redirect(`/street-arts/${streetart._id}`)
}));

app.delete("/street-arts/:id", catchAsync(async (req: { params: { id: any; }; }, res: { redirect: (arg0: string) => void; }) => {
    const { id } = req.params;
    await StreetArt.findByIdAndDelete(id);
    res.redirect("/street-arts")
}));

app.post("/street-arts/:id/comments", catchAsync(async(req: { params: { id: any; }; body: { comment: any; }; }, res: any) => {
    const streetArt = await StreetArt.findById(req.params.id)

    // Instantiate a new comment
    const comment = new Comment(req.body.comment)

    // Push the new review to the street art
    streetArt.comments.push(comment)
    await comment.save()
    await streetArt.save()

    res.redirect(`/street-arts/${streetArt._id}`);
}));

app.all("*", (req: any, res: { send: (arg0: string) => void; }, next: any) => {
    next(new ExpressError("Page Not Found!", 404))
});

app.use((err: any, req: any, res: { status: (arg0: any) => { (): any; new(): any; render: { (arg0: string, arg1: { err: any; }): void; new(): any; }; }; }, next: any) => {
    const { statusCode = 500, message = "Something went wrong!"} = err;
    if(!err.message) err.message = "Oops! Something went wrong here ):"
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("Server up on port 3000! 🚀")
})