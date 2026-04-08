const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const path = require('path')
const listings = require('./routes/listings.js')
const reviews = require('./routes/review.js')
const session =require("express-session")
const flash = require('connect-flash')
const MONGO_URL = "mongodb://localhost:27017/BookNest"

main().then(() => {
    console.log("coonected to database")
})
    .catch((err) => {
        console.log(err)
    })

async function main() {

    await mongoose.connect(MONGO_URL)
}


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.json())





const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};


app.get('/', (req, res) => {
    res.send('hi am root')
})

app.use(session(sessionOptions));
app.use(flash())







app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next()
})

app.use('/listings' , listings)
app.use('/listings/:id/reviews' , reviews)


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.render("error.ejs", { message })
});



app.listen(8080, function () {
    console.log("server is listening to port 8080")
})  