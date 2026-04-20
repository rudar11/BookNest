const mongoose = require('mongoose')
const Review = require('./review')

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2024/06/06/20/32/milky-way-8813395_1280.jpg" ,
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2024/06/06/20/32/milky-way-8813395_1280.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       

    }
}, { timestamps: true })


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing