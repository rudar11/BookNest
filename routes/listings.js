
const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing')
const { listingSchema  } = require('../schema.js')
const { isLoggedIn } = require('../middleware.js')
const validatelisting = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)


    if (error) {
let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}


router.get('/',wrapAsync(async (req, res) => {

    const allListing = await Listing.find({})
    res.render("listings/index", { allListing })
}))


//new route
router.get('/new',  isLoggedIn, (req, res) => {

    res.render("listings/new")

})

//show route
router.get('/:id' ,wrapAsync(async (req, res) => {

    const { id } = req.params

    const listing = await Listing.findById(id).populate("reviews")
if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
   return res.redirect("/listings");
}
    res.render("listings/show", { listing })

}))

//Create Route
router.post("/", isLoggedIn, validatelisting ,wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    req.flash("success" , "new listing create")
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",  isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
   return res.redirect("/listings");
}
    res.render("listings/edit.ejs", { listing });
}))



//Update Route
router.put("/:id",isLoggedIn ,validatelisting , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "listing updated")
    res.redirect(`/listings/${id}`);
}));




//Delete Route
router.delete("/:id",  isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
req.flash("success" , "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;