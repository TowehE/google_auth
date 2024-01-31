const express = require('express');
require("./dbConfg/dbConfg")

require("dotenv").config()

 const userRouter = require("./router/router");
const session = require('express-session');
const passport = require("passport");
const userModel = require('./model/model');
const GoogleStrategy = require("passport-google-oauth2").Strategy

const app = express()

app.use(express.json())

app.use(session({ 
    secret: process.env.sessionSecret, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))

// intialize passport
  app.use(passport.initialize())
// integrate passport with session auth
  app.use(passport.session())

  passport.use(new GoogleStrategy({
    clientID:    process.env.clientID,
    clientSecret: process.env.clientsecret,
    callbackURL: process.env.callbackURL,
   // passReqToCallback   : true
  },
  async(request, accessToken, refreshToken, profile, done)=> {
    try {
      // Check if the user already exists in your database
      let user = await userModel.findOne({ email:profile.email});
      
      if (!user) {
        // If the user doesn't exist, create a new user
       const user = await userModel.create({
          firstName : profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          profilePicture :profile.picture,
          isVerified : profile.verified
          // You can add more fields here as needed
        });
          
      return done(null, user)
      }

  
      else{
        return done(null,profile)
      }
    } catch (error) {
      return done(error, false);
    }
  }
));

    


passport.serializeUser((user,done)=>{
  return done(null, user)
})

passport.deserializeUser((user,done)=>{
  return done(null, user)
})
// passport.deserializeUser(async (user, done) => {
//   try {
//     const user = await userModel.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// })




app.use("/", userRouter)


const port = process.env.port
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})

