const User = require("../models/user");

module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
  };

  module.exports.renderSignupForm = async (req, res) => {
      try {
        let { username, email, password } = req.body;
        const newCust = new User({ username, email });
        const registerUser = await User.register(newCust, password);
        req.login(registerUser,(err)=>{
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to WonderLust");
          res.redirect("/listings");
        });
      } catch (er) {
        req.flash("error", er.message);
        res.redirect("/signup");
      }
    };

    module.exports.login = (req, res) => {
        res.render("users/login.ejs");
      };

      module.exports.renderLoginForm = async (req, res) => {
        // if(re)
        req.flash("success","Welcome back to WonderLust.Successful Logged in.!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        return res.redirect(redirectUrl);
      };

      module.exports.logout = (req,res,next)=>{
        req.logOut((err)=>{
           if(err){
              return next(err);
           }
           req.flash("success","You are successfully logged out...");
           res.redirect("/listings");
        });
      };