const express = require("express");
const router = express.Router();

router.get("/create", (req, res) => {
    res.render("createexpense", { title: "Expense Tracker | Create Expense" });
});

router.get("/show", (req, res) => {
    res.render("showexpense", { title: "Expense Tracker | Watch Expense" });
});

module.exports = router;
