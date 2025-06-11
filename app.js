if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON requests are parsed
const ejs = require("ejs");
const { nextTick } = require("process");
app.engine("ejs", require("ejs").__express);
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const dbURL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbURL);
}
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

  const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret:"process.env.SECRET"
  }
})

store.on("error", function (e) {
  console.log("Session Store Error", e);
});
// Session configuration
const sessionOption = {
  store: store,
  secret: "process.env.SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption)); // we use before our routes
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deleteMsg = req.flash("deleteMsg");
  res.locals.updateMsg = req.flash("updateMsg");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
//Start file
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});
app.listen("8080", () => {
  console.log("conneted to port 8080");
});
