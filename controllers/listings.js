const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings,
    category,
    search,
  });
};

module.exports.renderAddForm = (req, res) => {
  const categories = [
    "Trending",
    "Beach",
    "Mountains",
    "Farms",
    "Luxury",
    "Camping",
    "Pools",
    "Rooms",
  ];
  res.render("listings/new.ejs", { categories });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist !");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.addListing = async (req, res) => {
  let { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.category = listing.category;

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }
  await newListing.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist !");
    res.redirect("/listings");
  }
  let orignalListingImage = listing.image.url;
  orignalListingImage = orignalListingImage.replace("/upload", "/upload/h_300");
  res.render("listings/edit.ejs", { listing, orignalListingImage });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have Permission to Edit !");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted !");
  res.redirect(`/listings`);
};
