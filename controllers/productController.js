const Product = require('../models/productModel')

/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *    type: object
 *    required:
 *     - productname
 *     - img
 *     - price
 *     - type
 *     - status
 *    properties:
 *     productname:
 *      type: string
 *      description: The productname of the product
 *     img:
 *      type: string
 *      description: The image url of the product
 *     price:
 *      type: string
 *      description: The price of the product
 *     type:
 *      type: string
 *      description: The type of the product
 *     status:
 *      type: string
 *      default: 'active'
 *      description: The status of the product
 */


/**
 * @swagger
 * tags:
 *  name: Product
 *  description: The product managing API
*/


/**
 * @swagger
 * /api/products/medicines:
 *   get:
 *    summary: Get all medicines
 *    tags: [Product]
 *    responses:
 *      200:
 *       description: The list of the medicines
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/Product'         
 */


module.exports.medicines = async (req,res,next) => {
    try {
        const medicines = await Product.find({type: 'medicine'})
        return res.json(medicines)
    }
    catch(err) {
        next(err)
    }
}


/**
 * @swagger
 * /api/products/healthcare:
 *   get:
 *    summary: Get all healthcare products
 *    tags: [Product]
 *    responses:
 *      200:
 *       description: The list of the healthcare products
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/Product'         
 */


module.exports.healthcare = async (req,res,next) => {
    try {
        const healthcare = await Product.find({type: 'healthcare'})
        return res.json(healthcare)
    }
    catch(err) {
        next(err)
    }
}


/**
 * @swagger
 * /api/products/pharmaceutical:
 *   get:
 *    summary: Get all pharmaceutical products
 *    tags: [Product]
 *    responses:
 *      200:
 *       description: The list of the pharmaceutical products
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/Product'         
 */


module.exports.pharmaceutical = async (req,res,next) => {
    try {
        const pharmaceuticals = await Product.find({type: 'pharmaceutical'})
        return res.json(pharmaceuticals)
    }
    catch(err) {
        next(err)
    }
}


/**
 * @swagger
 * /api/products/{id}:
 *   post:
 *    summary: Get a product by id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    responses:
 *      200:
 *       description: Details of specific product
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/Product'         
 */


module.exports.product = async (req,res,next) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.json(product)
    }
    catch(err) {
        next(err)
    }
}


/**
 * @swagger
 * /api/products/newProduct:
 *   post:
 *    summary: Create a new product
 *    security:
 *     - bearerAuth: []
 *    tags: [Product]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *         ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *       description: The product was successfully created
 *       content:
 *        application/json:
 *          schema:
 *            status:
 *              type: boolean
 *              description: The status of the product creation         
 */


module.exports.newProduct = async (req,res,next) => {
    try {
        const { productname, img, type, price, status } = req.body;
        const productCheck = await Product.findOne({ productname })
        if(!productCheck){ 
            const product = new Product({productname, img, type, price, status});
            await product.save();
            return res.json({status : true})
        }
        else{
            return res.json({status : false})
        }
    }
    catch (err) {
        next(err);
    }
}


/**
 * @swagger
 * /api/products:
 *   get:
 *    summary: Get all products
 *    tags: [Product]
 *    responses:
 *      200:
 *       description: The list of the products
 *       content:
 *        application/json:
 *          schema:
 *            ref: '#/components/schemas/Product'         
 */


module.exports.allProducts = async(req,res,next) => {
    try{
        const products = await Product.find({})
        const productArray = []
        for(let i=0; i<products.length; i++){
            productArray.push({...products[i], id : i + 1})
        }
        return res.json(productArray)
    }
    catch(err){
       next(err);
   }
}


module.exports.addProduct = async (req,res,next) => {
    try {
        const { productname, img, type, price, status } = req.body;
        const productCheck = await Product.findOne({ productname })
        if(!productCheck){ 
            const product = new Product({productname, img, type, price, status});
            await product.save();
            return res.json({status : true})
        }
        else{
            return res.json({status : false})
        }
    }
    catch (err) {
        next(err);
    }
}