const Query = require("../models/queryModel");
const Prescription = require("../models/prescriptionModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const Payment = require("../models/paymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * @swagger
 * components:
 *  schemas:
 *   Query:
 *    type: object
 *    required:
 *     - username
 *     - email
 *     - ques
 *     - sug
 *    properties:
 *     username:
 *      type: string
 *      description: username of the user
 *     email:
 *      type: string
 *      description: email of the user
 *     ques:
 *      type: string
 *      description: question of the user
 *     sug:
 *      type: string
 *      description: suggestion of the user
 */

/**
 * @swagger
 * tags:
 *  name: Query
 *  description: The query managing API
 */

/**
 * @swagger
 * /api/services/query:
 *  post:
 *   summary: Create a new query
 *   security:
 *     - bearerAuth: []
 *   tags: [Query]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       ref: '#/components/schemas/Query'
 *   responses:
 *    200:
 *     description: The query sent successfully
 *     content:
 *      application/json:
 *       schema:
 *         status:
 *          type: boolean
 */

module.exports.query = async (req, res, next) => {
  try {
    const { name, email, ques, sug } = req.body;
    const query = new Query({
      username: name,
      email,
      ques,
      sug,
    });

    await query.save();
    return res.json({ status: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/services/allqueries:
 *  get:
 *   summary: Get all queries
 *   tags: [Query]
 *   responses:
 *    200:
 *     description: The queries were successfully retrieved
 *     content:
 *      application/json:
 *       schema:
 *         ref: '#/components/schemas/Query'
 */

module.exports.allQueries = async (req, res, next) => {
  try {
    const queries = await Query.find({});
    const queryArray = [];
    for (let i = 0; i < queries.length; i++) {
      queryArray.push({ ...queries[i], id: i + 1 });
    }
    // console.log(queryArray)
    return res.json(queryArray);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * components:
 *  schemas:
 *   Transaction:
 *    type: object
 *    required:
 *     - accountholder
 *     - phone
 *     - accountnumber
 *     - ifsc
 *     - amount
 *     - pincode
 *     - address
 *    properties:
 *     accountholder:
 *      type: string
 *      description: accountholder of the user
 *     phone:
 *      type: string
 *      description: phone of the user
 *     accountnumber:
 *      type: string
 *      description: accountnumber of the user
 *     ifsc:
 *      type: string
 *      description: ifsc code of the user
 *     amount:
 *      type: integer
 *      description: amount of the user
 *     pincode:
 *      type: string
 *      description: pincode of the user location
 *     address:
 *      type: string
 *      description: address of the user
 */

/**
 * @swagger
 * tags:
 *  name: Transaction
 *  description: The transaction managing API
 */

/**
 * @swagger
 * /api/services/alltransactions:
 *  get:
 *   summary: Get all Transactions
 *   tags: [Transaction]
 *   responses:
 *    200:
 *     description: The transactions were successfully retrieved
 *     content:
 *      application/json:
 *       schema:
 *         ref: '#/components/schemas/Transaction'
 */

module.exports.allTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.find({});
    const transactionArray = [];
    for (let i = 0; i < transactions.length; i++) {
      transactionArray.push({ ...transactions[i], id: i + 1 });
    }
    // console.log(queryArray)
    return res.json(transactionArray);
  } catch (err) {
    next(err);
  }
};

module.exports.prescriptionUpload = async (req, res, next) => {
  try {
    const { url, username, productname } = req.body;
    const user = await User.findOne({ username });
    const product = await Product.findOne({ productname });
    const prescriptionCheck = await Prescription.findOne({
      user: user._id,
      product: product._id,
    });
    if (prescriptionCheck) {
      const prescription = await Prescription.findOneAndUpdate(
        { user: user._id, product: product._id },
        { prescription: url }
      );
      return;
    } else {
      const prescription = new Prescription({
        user,
        product,
        prescription: url,
      });
      await prescription.save();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addComment = async (req, res, next) => {
  try {
    const { comment, username, productname } = req.body;
    // console.log(req.body)
    // await Review.deleteMany({})
    const user = await User.findOne({ username });
    const product = await Product.findOne({ productname });
    const review = new Review({ user, product, comment });
    await review.save();
    return res.json({ status: true });
  } catch (err) {
    next(err);
  }
};

module.exports.allComments = async (req, res, next) => {
  try {
    const reviews = await Review.find({}).populate("user").populate("product");
    // console.log(reviews);
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports.paymentFunction = async (req, res, next) => {
  try {
    const { username, amount } = req.body;

    const payment = new Payment({ accountholder: username, amount });
    await payment.save();

    stripe.charges.create(req.body, (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).send({ error: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.prescriptioncheck = async (req, res, next) => {
  try {
    const pc = await Prescription.find({})
      .populate({
        path: "user",
        model: User,
        select: "username",
      })
      .populate({
        path: "product",
        model: Product,
        select: "productname",
      });
    // console.log("mdmmd", pc);
    const pcArray = [];
    for (let i = 0; i < pc.length; i++) {
      pcArray.push({ ...pc[i], id: i + 1 });
    }
    // console.log(pcArray);
    return res.json(pcArray);
  } catch (err) {
    next(err);
  }
};

module.exports.prescriptionStatus = async (req, res, next) => {
  try {
    const { status, userId, productId } = req.body;
    const prescription = await Prescription.findOneAndUpdate(
      { user: userId, product: productId },
      { status: status }
    );
    return res.json({ prescription });
  } catch (err) {
    next(err);
  }
};

module.exports.prescriptionStatusCheck = async (req, res, next) => {
  try {
    const { user, productId } = req.body;
    const u = await User.findOne({ username: user.username });
    const prescription = await Prescription.findOne({
      user: u._id,
      product: productId,
    });
    return res.json({ prescription });
  } catch (err) {
    next(err);
  }
};
