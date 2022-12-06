const router = require('express').Router();

const {loginUser} = require("../controllers/apiLoginControllers");



router
    .post('/login', loginUser);

module.exports = router;
