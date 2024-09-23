const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user.schema");

const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(UserSchema.authenticate()));
// passport.use(User.createStrategy()); // crediential other than username

const { isLoggedIn } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multimedia.middleware");
const imagekit = require("../config/imagekit");
const fs = require("fs");

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

router.post("/signin", passport.authenticate("local"), async (req, res) => {
    try {
        // set cache to store user details
        req.flash("success", "Successfully LoggedIn!");
        res.redirect("/user/profile");
    } catch (error) {
        console.log(error);
        next(error);
        // res.redirect("/user/signin");
    }
});

// router.post(
//     "/signin",
//     passport.authenticate("local", {
//         successRedirect: "/user/profile",
//         failureRedirect: "/user/signin",
//     }),
//     (req, res) => {}
// );

router.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const message = req.flash("success");

        res.render("profileuser", {
            title: "Expense Tracker | Profile",
            user: req.user,
            message,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/signout", isLoggedIn, async (req, res) => {
    req.logout(() => {
        // delete cache from redis
        res.redirect("/user/signin");
    });
});

router.get("/reset-password", isLoggedIn, async (req, res) => {
    res.render("resetpassworduser", {
        title: "Expense Tracker | Reset Password",
        user: req.user,
    });
});

router.post("/reset-password", isLoggedIn, async (req, res) => {
    try {
        await req.user.changePassword(
            req.body.oldpassword,
            req.body.newpassword
        );
        await req.user.save();
        res.redirect("/user/profile");
    } catch (error) {
        next(error);
    }
});

router.get("/delete-account", isLoggedIn, async (req, res) => {
    try {
        const user = await UserSchema.findByIdAndDelete(req.user._id);
        if (user.avatar != "default.jpg") {
            fs.unlinkSync(`public/images/${user.avatar}`);
        }
        // delete cache from redis
        // code to delete all relaated expenses
        res.redirect("/user/signin");
    } catch (error) {
        next(error);
    }
});

router.get("/update", isLoggedIn, async (req, res) => {
    res.render("updateuser", {
        title: "Expense Tracker | Update User",
        user: req.user,
    });
});

router.post("/update", isLoggedIn, async (req, res) => {
    try {
        await UserSchema.findByIdAndUpdate(req.user._id, req.body);
        // set cache to store user details with updated details
        res.redirect("/user/profile");
    } catch (error) {
        next(error);
    }
});

router.post("/avatar", isLoggedIn, async (req, res, next) => {
    try {
        if (req.user.avatar.fileId) {
            await imagekit.deleteFile(req.user.avatar.fileId);
        }

        const result = await imagekit.upload({
            file: req.files.avatar.data,
            fileName: req.files.avatar.name,
        });
        const { fileId, url, thumbnailUrl } = result;

        req.user.avatar = { fileId, url, thumbnailUrl };
        await req.user.save();
        res.redirect("/user/update");
    } catch (error) {
        next(error);
    }
});

// router.post(
//     "/avatar",
//     isLoggedIn,
//     upload.single("avatar"),
//     async (req, res) => {
//         try {
//             if (req.user.avatar != "default.jpg") {
//                 fs.unlinkSync(`public/images/${req.user.avatar}`);
//             }
//             req.user.avatar = req.file.filename;
//             await req.user.save();
//             // set cache to store user details with updated avatar
//             res.redirect("/user/update");
//         } catch (error) {
//             next(error);
//         }
//     }
// );

router.get("/forget-password", async (req, res) => {
    res.render("forgetpassword_email", {
        title: "Expense Tracker | Forget Password",
        user: req.user,
    });
});

router.post("/forget-password", async (req, res, next) => {
    try {
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user) return next(new Error("User not found!"));

        // send email to user with otp
        // and save the same otp to database

        res.redirect(`/user/forget-password/${user._id}`);
    } catch (error) {
        next(error);
    }
});

router.get("/forget-password/:id", async (req, res) => {
    res.render("forgetpassword_otp", {
        title: "Expense Tracker | Forget Password",
        user: req.user,
        id: req.params.id,
    });
});

router.post("/forget-password/:id", async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.params.id);

        // compare the req.body.otp with the otp in database
        // if matched redirect to password page else ERROR

        // set cache to store user details with updated otp
        res.redirect(`/user/set-password/${user._id}`);
    } catch (error) {
        next(error);
    }
});

router.get("/set-password/:id", async (req, res) => {
    res.render("forgetpassword_password", {
        title: "Expense Tracker | Set Password",
        user: req.user,
        id: req.params.id,
    });
});

router.post("/set-password/:id", async (req, res, next) => {
    try {
        const user = await UserSchema.findById(req.params.id);
        await user.setPassword(req.body.password);
        await user.save();
        // set cache to store user details with updated password
        res.redirect("/user/signin");
    } catch (error) {
        next(error);
    }
});

module.exports = router;
