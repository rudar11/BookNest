
const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require('../models/listing.js')

const { isLoggedIn , isOwner , validatelisting } = require('../middleware.js')

const listingController = require("../controllers/listings.js")

router.get('/', wrapAsync(listingController.index))


//new route
router.get('/new', isLoggedIn , listingController.renderNewForm)

//show route
router.get('/:id', wrapAsync(listingController.showListing))

//Create Route
router.post("/", isLoggedIn, validatelisting, wrapAsync(listingController.createlisting));

//Edit Route
router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(listingController.renderEditForm))



//Update Route
router.put("/:id", isLoggedIn, isOwner, validatelisting, wrapAsync(listingController.updateListing));




//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;