var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Expense Tracker | Homepage" });
});

router.get("/about", function (req, res, next) {
    res.render("about", { title: "Expense Tracker | About" });
});

module.exports = router;
