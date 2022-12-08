const router = require('express').Router();

const {findOrCreateChat, findAllChatsForCurrentUser} = require("../controllers/apiChatsControllers");



router
    .post('/chats', findOrCreateChat)
    .get('/chats', findAllChatsForCurrentUser)


module.exports = router;
