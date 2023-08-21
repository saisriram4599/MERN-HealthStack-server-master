const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require('redis');

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.connect()
.then(() => {
    console.log('Redis connected')
})
.catch((err) => {
    console.log(err.message)
})

module.exports = client;

module.exports.cacheUserLogin = async (req, res, next) => {
  const { username, email, password, usertype } = req.body;
  const data = await client.get(username);
  if (data !== null) {
    if (email !== JSON.parse(data).email) {
      res.json({ msg: "Invalid email", status: false });
    }

    if (password !== JSON.parse(data).password) {
      res.json({ msg: "Invalid password", status: false });
    }
    if (usertype !== JSON.parse(data).usertype) {
      res.json({ msg: "Invalid usertype", status: false });
    }

    const accessToken = jwt.sign(
      {
        username: username,
        email: email,
        usertype: usertype,
      },
      process.env.JWT_SECRET_KEY
    );
    delete data.password;
    client.flushAll();
    return res.json({ status: true, user: JSON.parse(data), accessToken });
  } else {
    console.log("no cache")
    next();
  }
};
