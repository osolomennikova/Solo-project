const {User} = require("../db/models");
const bcrypt = require("bcrypt");


exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        const passCheck = await bcrypt.compare(password, user.password);
        if (passCheck) {
            req.session.currentUserName = user.userName;
            req.session.currentUserId = user.id;
            req.session.save(() => {
                res.send({message: "Login successful"});
            });
        } else {
            res.send({message: "Incorrect email or password"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
