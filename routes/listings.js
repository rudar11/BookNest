
const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing')
const { listingSchema  } = require('../schema.js')

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
router.get('/new', async (req, res) => {

    res.render("listings/new")

})




//show route
router.get('/:id' ,wrapAsync(async (req, res) => {

    const { id } = req.params

    const listing = await Listing.findById(id).populate("reviews")

    res.render("listings/show", { listing })

}))



//Create Route


router.post("/", validatelisting ,wrapAsync(async (req, res) => {


    const newListing = new Listing(req.body.listing);


    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))



//Update Route
router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));




//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));

module.exports = router;