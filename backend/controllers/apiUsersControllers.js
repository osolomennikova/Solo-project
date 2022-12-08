const {Op} = require('sequelize');
const {User} = require('../db/models');

exports.allUsers = async (req, res) => {

    try {
        if (req.session.currentUserName) {
            const users = await User.findAll({
                attributes: ['id', 'userName']
            });
            res.json({users});
        } else {
            res.send({message: 'You have to be logged in to see all users'});
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

exports.searchUsers = async (req, res) => {
    try {
        if (req.session.currentUserName) {
            const users = await User.findAll({
                attributes: ['id', 'userName'],
                where: {
                    userName: {
                        [Op.like]: `%${req.query.query}%`
                    }
                },
                limit: parseInt(req.query.limit) || 10
            });
            res.json({users});
        } else {
            res.send({message: 'You have to be logged in to see all users'});
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}
