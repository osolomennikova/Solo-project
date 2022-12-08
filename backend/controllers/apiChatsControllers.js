const {Op, fn, col} = require('sequelize');
const {User, UserChat, Room} = require('../db/models');

exports.findOrCreateChat = async (req, res) => {
    try {
        const {userId} = req.body;
        const {currentUserId} = req.session;
        const chat = await UserChat.findAll({
            attributes: ['room_id'],
            where: {
                [Op.or]: [
                    {user_id: currentUserId},
                    {
                        user_id: userId
                    },
                ]
            },
            group: ['room_id'],
            order: [[fn('count', col('user_id')), 'DESC']],
            limit: 1,
        })
        console.log(chat);
        res.json({chat});
        return;

        const room = await Room.findOne({
            where: {
                id: chat.room_id
            }
        });
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
            await UserChat.create({
                user_id: currentUserId,
                room_id: newRoom.id,
                chat_name: currentUserName
            });
            await UserChat.create({
                user_id: userId,
                room_id: newRoom.id,
                chat_name: userName
            });
            res.json({room: newRoom});
        } else {
            res.json({room});
        }

    } catch (error) {
        res.status(500).send({message: error.message});
    }

};
