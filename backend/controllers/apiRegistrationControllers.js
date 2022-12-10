const bcrypt = require("bcrypt");
const {User} = require("../db/models");


exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const newUser = await User.create({ userName:name, email, password: hash });
        req.session.currentUserName = newUser.userName;
        req.session.currentUserId = newUser.id;
        req.session.save(() => {
            res.json({ userName: newUser.userName });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
