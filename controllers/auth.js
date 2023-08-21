const Users = require('../models/users');
const db = require('../connection'); 
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
module.exports = {
  login: async (req, res) => {
    try {
      const username = req.body.username
      const password = req.body.password
      await db.initialize();
      const user = await Users.findOne({ where: { username } });
      if(user.dataValues.password !== password){
        return res.status(400).send({
          message: 'Password incorrect!',
        });
      }
      const token = jwt.sign({ username: user.username, timestamp: new Date().getTime() },
        process.env.JWT_SECRET,
        {
          algorithm: 'HS256',
        });
      await Users.update({ token }, {
        where: {
          username: user.username
        }
      });
      res.status(200).send({
        token
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  },
  validate: async (req, res) => {
    try {
      const token = req.body.token;
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      res.status(200).send({
        username: decoded.username
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
};





