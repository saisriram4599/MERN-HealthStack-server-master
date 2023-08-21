const bcrypt = require("bcrypt");
const User = require("../models/userModel");

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
 *  name: Profile
 *  description: The profile information managing API
 */

/**
 * @swagger
 * /api/users/updateprofile:
 *  post:
 *   summary: Update user profile
 *   tags: [Profile]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        actualName:
 *         type: string
 *         description: Actual username of the user
 *        username:
 *         type: string
 *         description: New username of the user
 *        email:
 *         type: string
 *         description: New email of the user
 *        password:
 *         type: string
 *         description: New password of the user
 *        phone:
 *         type: string
 *         description: New phone number of the user
 *        address:
 *         type: string
 *         description: New address of the user
 *   responses:
 *    200:
 *     description: The profile updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        status:
 *         type: boolean
 *         description: Status of the profile update
 *       msg:
 *        type: string
 *        description: Message of the profile update
 */

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { actualName, username, email, password, phone, address } = req.body;
    if (username.length < 5)
      return res
        .status(400)
        .json({
          msg: "Username must be at least 5 characters long.",
          status: false,
        });
    const updatedPassword = await bcrypt.hash(password, 12);
    const user = await User.updateOne(
      { username: actualName },
      {
        username,
        email,
        password: updatedPassword,
        confirmPassword: updatedPassword,
        phone,
        address,
      }
    );
    return res
      .status(200)
      .json({ msg: "Profile updated successfully.", status: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/users/profilepic:
 *  post:
 *   summary: Upload profile picture
 *   tags: [Profile]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *     schema:
 *      type: object
 *      properties:
 *       url:
 *        type: string
 *        description: The url of the profile picture
 *       username:
 *        type: string
 *        description: The username of the user
 *   responses:
 *    200:
 *     description: The profile picture uploaded successfully
 *     content:
 *      application/json:
 *       schema:
 *        status:
 *         type: boolean
 *         description: Status of the profile picture upload
 *        msg:
 *         type: string
 *         description: Message of the profile picture upload
 */

module.exports.uploadProfilePic = async (req, res, next) => {
  try {
    const { url, username } = req.body;
    // console.log(req.body)
    const user = await User.findOneAndUpdate({ username }, { profilePic: url });
    // console.log(user)
    return res
      .status(200)
      .json({ msg: "Profile picture uploaded successfully.", status: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/users/profiledetails:
 *  post:
 *   summary: Get user profile details by username and email
 *   tags: [Profile]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *         description: The username of the user
 *        email:
 *         type: string
 *         description: The email of the user
 *   responses:
 *    200:
 *     description: The profile details fetched successfully
 *     content:
 *      application/json:
 *       schema:
 *        ref: '#/components/schemas/User'
 */

module.exports.profileDetails = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};


/**
 * @swagger
 *  tags:
 *    name: User
 *    description: The user managing API
 */


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *    summary: Get user by id
 *    tags: [User]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *         description: The id of the user
 *    responses:
 *      200:
 *       description: The user fetched successfully
 *       content:
 *        application/json:
 *         schema:
 *          ref: '#/components/schemas/User'
 */


module.exports.user = async (req, res, next) => {
  try {
    // console.log(req.params.id)
    const user = await User.findById(req.params.id);
    // console.log(user)
    return res.json(user);
  } catch (err) {
    next(err);
  }
};


/**
 * @swagger
 * /api/users:
 *  get:
 *   summary: Get all users
 *   tags: [User]
 *   responses:
 *    200:
 *     description: The users fetched successfully
 *     content:
 *       application/json:
 *        schema:
 *           ref: '#/components/schemas/User' 
 */


module.exports.userList = async (req, res, next) => {
  try {
    const users = await User.find();
    // console.log(users);
    const userArray = [];
    for (let i = 0; i < users.length; i++) {
      userArray.push({ ...users[i], id: i + 1 });
    }
    // console.log(userArray);
    return res.json(userArray);
  } catch (err) {
    next(err);
  }
};
