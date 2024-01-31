const express = require('express');
const router =express.Router()

const {
    homepage,
    createUser,
    logIn,
    logOut,
    
}= require("../controller/userController")

//endpoint for the homepage
router.get('/', homepage);

//endpoint to create a new user
router.post('/signUp', createUser)

// //endpoint to create a new user
 router.post('/logIn', logIn)


//endpoint to create a new user
router.get('/sociallogIn', async(req,res)=>{
    res.redirect("http://localhost:4455/auth/google/")

})
 
const passport = require('passport')
    
router.get("/auth/google", passport.authenticate("google",{scope:["email","profile"]}) )

router.get("/auth/google/callback", passport.authenticate("google",{
    // if authentication is suuccessful
    successRedirect: "/auth/google/success",
    // if authentication fails
    failureRedirect: "/auth/google/failure"
}))
router.get("/auth/google/success", (req,res)=>{

const username=req.user.email
req.session.user={username}
res.json("user authenticated")

console.log(req.session.user)
})
 
router.post("/logout",logOut)



module.exports = router 