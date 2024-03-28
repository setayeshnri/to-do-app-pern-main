const express = require("express");

/*
This line imports the authController object from the ../controllers/auth.controller file. 
This object contains functions to handle signup and login logic.
*/
const authController = require("../controllers/auth.controller");

/*
creates a new instance of the Express router, which is used to define routes for the application.
*/
const router = express.Router();

/*
This line defines a POST route for the "/signup" endpoint. When a POST request is made to this endpoint, 
Express will execute the signup function from the authController.
This line defines a POST route for the "/login" endpoint. When a POST request is made to this endpoint, 
Express will execute the login function from the authController.
*/

router.post("/signup", authController.signup);
router.post("/login", authController.login);

/*
This line exports the router object, making it available for use in other parts of the application. 
It allows the defined routes to be mounted as middleware.
*/
module.exports = router;
