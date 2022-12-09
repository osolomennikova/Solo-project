const router = require('express').Router();

const {findOrCreateChat, findAllChatsForCurrentUser, findHistoryForChat} = require("../controllers/apiChatsControllers");



router
    .post('/chats', findOrCreateChat)
    .get('/chats', findAllChatsForCurrentUser)
    .get(`/chats/:id`, findHistoryForChat)


module.exports = router;
