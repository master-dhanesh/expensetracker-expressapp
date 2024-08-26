const express = require("express");
const router = express.Router();
const ExpenseSchema = require("../models/expense.schema");

router.get("/create", (req, res) => {
    res.render("createexpense", { title: "Expense Tracker | Create Expense" });
});

router.post("/create", async (req, res, next) => {
    try {
        const newexpense = new ExpenseSchema(req.body);
        await newexpense.save();
        res.redirect("/expense/show");
    } catch (error) {
        next(error);
    }
});

router.get("/show", (req, res) => {
    res.render("showexpense", { title: "Expense Tracker | Watch Expense" });
});

module.exports = router;
