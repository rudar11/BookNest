
const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require('../models/listing')

const { isLoggedIn , isOwner , validatelisting } = require('../middleware.js')



router.get('/', wrapAsync(async (req, res) => {

    const allListing = await Listing.find({})
    res.render("listings/index", { allListing })
}))


//new route
router.get('/new', isLoggedIn, (req, res) => {

    res.render("listings/new")

})

//show route
router.get('/:id', wrapAsync(async (req, res) => {

    const { id } = req.params

    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show", { listing })

}))

//Create Route
router.post("/", isLoggedIn, validatelisting, wrapAsync(async (req, res) => {

    const newListing = new Listing(req.body.listing);
  
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "new listing create")
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing }); 
}))



//Update Route
router.put("/:id", isLoggedIn, isOwner, validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;



    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
}));




//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;