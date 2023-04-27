const mongoose = require("mongoose");
const { DB_URL } = require("./index");

const connection = mongoose.createConnection(DB_URL, {});

// mongoose.set("debug", true);
module.exports = connection;
