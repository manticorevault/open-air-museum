const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req: any, res: { render: (arg0: string) => void; }) => {
    res.render("home")
});

app.listen(3000, () => {
    console.log("Server up on port 3000! 🚀")
})