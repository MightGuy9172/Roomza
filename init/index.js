if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = process.env.DB_URL;

main()
  .then(() => console.log("Connected to DB !"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

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

  const updatedData = initData.data.map((obj, index) => ({
    ...obj,
    owner: "697075293781aebbef7c080f",
    category: categories[index % categories.length],
  }));

  await Listing.insertMany(updatedData);
  console.log("Data was Initialized Successfully !");
};

initDB();
