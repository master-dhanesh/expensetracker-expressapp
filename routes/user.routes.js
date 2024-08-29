const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user.schema");
const { isLoggedIn } = require("../middlewares/auth.middleware");

const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(UserSchema.authenticate()));
// passport.use(User.createStrategy()); // crediential other than username

router.get("/signup", async (req, res) => {
    res.render("signupuser", {
        title: "Expense Tracker | Signup",
        user: req.user,
    });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await UserSchema.register({ username, email }, password);
        // await UserSchema.authenticate(username, password);
        // res.redirect("/user/profile");
        res.redirect("/user/signin");
    } catch (error) {
        next(error);
    }
});

router.get("/signin", async (req, res) => {
    res.render("signinuser", {
        title: "Expense Tracker | Signin",
        user: req.user,
    });
});

// router.post("/signin", passport.authenticate("local"), async (req, res) => {
//     try {
//         res.redirect("/user/profile");
//     } catch (error) {
//         next(error);
//     }
// });

router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/user/profile",
        failureRedirect: "/user/signin",
    }),
    (req, res) => {}
);

router.get("/profile", isLoggedIn, async (req, res) => {
    try {
        res.render("profileuser", {
            title: "Expense Tracker | Profile",
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/signout", isLoggedIn, async (req, res) => {
    req.logout(() => {
        res.redirect("/user/signin");
    });
});

module.exports = router;
