const {Op, fn, col} = require('sequelize');
const {User, UserChat, Room, History} = require('../db/models');

exports.findOrCreateChat = async (req, res) => {
    try {
        const {userId} = req.body;
        const {currentUserId} = req.session;
        const chats = await UserChat.findAll({
            attributes: ['room_id', [fn('COUNT', col('room_id')), 'count_users']],
            where: {
                [Op.or]: [
                    {user_id: currentUserId},
                    {
                        user_id: userId
                    },
                ],
            },
            group: ['room_id'],
        })
        const room = chats.find(chat => chat.dataValues.count_users === "2");
        if (!room) {
            const newRoom = await Room.create();
            const {userName: currentUserName} = await User.findOne({
                where: {
                    id: currentUserId
                }
            })
            const {userName: userName} = await User.findOne({
                where: {
                    id: userId
                }
            });
            const {
                id, chat_name
            } = await UserChat.create({
                user_id: currentUserId,
                room_id: newRoom.id,
                chat_name: userName
            });
            await UserChat.create({
                user_id: userId,
                room_id: newRoom.id,
                chat_name: currentUserName
            });
            res.json({
                id,
                chat_name
            });
        } else {
            const {id, chat_name} = await UserChat.findOne({
                where: {
                    room_id: room.dataValues.room_id,
                    user_id: currentUserId
                }
            })
            res.json({
                id,
                chat_name
            });
        }

    } catch (error) {
        res.status(500).send({message: error.message});
    }

};

exports.findAllChatsForCurrentUser = async (req, res) => {
    try {
        if (req.session.currentUserName) {
            const chats = await UserChat.findAll({
                attributes: ['id', 'chat_name'],
                where: {
                    user_id: req.session.currentUserId
                }
            })
            res.json({
                chats
            });
        } else {
            res.send({message: 'You have to be logged in to see all chats'});
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

exports.findHistoryForChat = async (req, res) => {
    try {
        if (req.session.currentUserName) {
            const {id} = req.params;
            const {room_id, chat_name} = await UserChat.findOne({
                where: {
                    id
                }
            })
            const room = await Room.findOne({
                where: {
                    id: room_id
                }
            });

            const histories = await History.findAll({
                where: {
                    room_id
                },
                include: {
                    model: User,
                }
            })
            res.json({
                messages: histories.map(history => ({
                    message: history.dataValues.message,
                    time: history.dataValues.createdAt,
                    user_id: history.dataValues.user_id,
                    user_name: history.dataValues.User.dataValues.userName
                })),
                chat_name,
                isPublic: !!room.dataValues.room_name,
                our_id: req.session.currentUserId,
            });
        } else {
            res.send({message: 'You have to be logged in to see all chats'});
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}


