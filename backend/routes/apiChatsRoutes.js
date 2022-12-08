const router = require('express').Router();

const {findOrCreateChat} = require("../controllers/apiChatsControllers");



router
    .post('/chats', findOrCreateChat)


module.exports = router;
