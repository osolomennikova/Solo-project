const router = require('express').Router();

const {allUsers, searchUsers} = require("../controllers/apiUsersControllers");



router
    .get('/users', allUsers)
    .get('/search/users', searchUsers);

module.exports = router;
