const router = require('express').Router();

const {findOrCreateGroup, getPublicRooms} = require("../controllers/apiGroupsControllers");



router
    .post('/groups', findOrCreateGroup)
    .get('/groups', getPublicRooms)


module.exports = router;
