const User = require("../models/userModel");
const Admin = require("../models/adminLoginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../middlewares/cacheMiddleware");

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *     - firstname
 *     - lastname
 *     - username
 *     - email
 *     - password
 *     - confirmPassword
 *     - usertype
 *     - pincode
 *     - phone
 *     - address
 *    properties:
 *     firstname:
 *      type: string
 *      description: The firstname of the user
 *     lastname:
 *      type: string
 *      description: The lastname of the user
 *     username:
 *      type: string
 *      description: The username of the user
 *     email:
 *      type: string
 *      description: The email of the user
 *     password:
 *      type: string
 *      description: The password of the user
 *     confirmPassword:
 *      type: string
 *      description: The confirmPassword of the user
 *     usertype:
 *      type: string
 *      description: The usertype of the user
 *     profilePic:
 *      type: string
 *      description: The profilePic of the user
 *     status:
 *      type: string
 *      description: The status of the user
 *     pincode:
 *      type: string
 *      description: The pincode of the user
 *     phone:
 *      type: string
 *      description: The phone of the user
 *     address:
 *      type: string
 *      description: The address of the user
 */

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: The authentication managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *    summary: Register a new user
 *    tags: [Authentication]
 *    requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *       description: Successfully registered
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/User'
 */

module.exports.register = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      confirmPassword,
      usertype,
      pincode,
      phone,
      address,
      cart,
      status,
      transaction,
      products,
    } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already exists", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already exists", status: false });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      usertype,
      pincode,
      phone,
      address,
      status,
      transaction,
      cart,
      products,
    });
    delete user.password;

    // Set data to Redis Cache
    client.set(
      username,
      JSON.stringify({
        email,
        password,
        usertype,
      }),
      'EX',
      5 * 60
    );

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *    summary: Login a user
 *    tags: [Authentication]
 *    requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             username:
 *              type: string
 *              description: The username of the user
 *             email:
 *               type: string
 *               description: The email of the user
 *             password:
 *               type: string
 *               description: The password of the user
 *             usertype:
 *               type: string
 *               description: The usertype of the user
 *    responses:
 *      200:
 *       description: Successfully logged in
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            status:
 *              type: boolean
 *              description: The status of the user login
 *            user:
 *              ref: '#/components/schemas/User'
 *              description: The user details
 *            accessToken:
 *              type: string
 *              description: The accessToken of the user
 */

module.exports.login = async (req, res, next) => {
  try {
    const { username, email, password, usertype } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (!usernameCheck)
      return res.json({ msg: "Invalid username", status: false });
    const emailCheck = await User.findOne({ email });
    if (!emailCheck) return res.json({ msg: "Invalid email", status: false });
    const passwordCheck = await bcrypt.compare(
      password,
      usernameCheck.password
    );
    if (!passwordCheck)
      return res.json({ msg: "Invalid password", status: false });
    const accessToken = jwt.sign(
      {
        username: usernameCheck.username,
        email: usernameCheck.email,
        usertype: usernameCheck.usertype,
      },
      process.env.JWT_SECRET_KEY
    );
    delete usernameCheck.password;
    return res.json({ status: true, user: usernameCheck, accessToken });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/auth/newPassword:
 *   post:
 *    summary: Create a new password
 *    tags: [Authentication]
 *    requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email of the user
 *             password:
 *               type: string
 *               description: The new password of the user
 *    responses:
 *      200:
 *       description: New password created successfully
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            status:
 *              type: boolean
 *              description: The status of the user login
 *            user:
 *              ref: '#/components/schemas/User'
 *              description: The user details
 */

module.exports.newPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, confirmPassword: hashedPassword }
    );
    return res.json({ status: true, user: user });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: The admin authentication managing API
 */

/**
 * @swagger
 * /api/auth/adminLogin:
 *  post:
 *   summary: Login a admin
 *   tags: [Admin Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        password:
 *         type: string
 *         description: The password of the admin
 *   responses:
 *    200:
 *     description: Admin successfully logged in
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          status:
 *           type: boolean
 *           description: The status of the admin login
 *          msg:
 *           type: string
 *           description: The message of the admin login status
 */

module.exports.adminLogin = async (req, res, next) => {
  try {
    const { password } = req.body;
    const adminCheck = await Admin.findOne({ password });
    if (!adminCheck) {
      return res.json({ msg: "Incorrect Admin Password", status: false });
    } else {
      return res.json({ status: true });
    }
  } catch (err) {
    next(err);
  }
};
