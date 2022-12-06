const router = require('express').Router();

const {registerUser} = require("../controllers/apiRegistrationControllers");



router
    .post('/registration', registerUser);

module.exports = router;
