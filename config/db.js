const mongoose = require("mongoose");

mongoose.connect(`${process.env.MONGOURL}expensetracker`);
const conn = mongoose.connection;

conn.on("open", () => {
    console.log("Dabatase Connected!");
});

conn.on("error", (err) => {
    console.log("ERROR >>>> ", err);
});

module.exports = conn;
