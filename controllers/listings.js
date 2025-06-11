const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let listing = await Listing.find();
  res.render("listings/index.ejs", { listing });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("deleteMsg", "Listing you required for does not exist");
    res.redirect(`/listings`);
  }
  res.render("listings/show.ejs", { list });
};

module.exports.createListing = async (req, res) => {
  let coordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const info = new Listing(req.body.listing);
  info.owner = req.user._id;
  info.image = { url, filename };
  info.geometry = coordinate.body.features[0].geometry;
  let coList = await info.save();
  console.log(coList);
  
  req.flash("success", "New listing added");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("deleteMsg", "Listing you required for does not exist");
    res.redirect(`/listings`);
  }
  let originalImageURL = list.image.url;
  originalImageURL.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { list, originalImageURL });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listFile = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listFile.image = { url, filename };
    await listFile.save();
  }
  req.flash("updateMsg", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  req.flash("deleteMsg", "Listing Deleted");
  res.redirect(`/listings`);
};
