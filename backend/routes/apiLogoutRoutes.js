const express = require('express');
const route = express.Router();
const { userLogout } = require('../controllers/apiLogoutControllers');


route
    .post('/logout', userLogout)

module.exports = route;
