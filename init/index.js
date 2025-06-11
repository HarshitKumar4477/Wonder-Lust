const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust");
}
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67bd71aea349991fa1b90e5e",
  }));
  await Listing.insertMany(initData.data);
  console.log("data inserted");
};

initDB();
