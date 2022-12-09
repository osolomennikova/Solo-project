const {UserChat, Room} = require('../db/models');

exports.findOrCreateGroup = async (req, res) => {
    try {
        if (req.session.currentUserName) {
            const {room_id, room_name} = req.body;
            const [row, created] = await UserChat.findOrCreate({
                where: {
                    room_id,
                    user_id: req.session.currentUserId,
                },
                defaults: {
                    room_id,
                    user_id: req.session.currentUserId,
                    chat_name: room_name
                }
            })
            res.json({
                id: row.id,
            });
        } else {
            res.send({message: 'You have to be logged in to see all chats'});
        }

    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

exports.getPublicRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            where: {
                room_name: {[Op.ne]: null},
            }
        });
        res.json({rooms});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}


