const { medicines,healthcare,pharmaceutical, 
       product, newProduct, allProducts, addProduct } = require('../controllers/productController')
const { verifyToken } = require('../middlewares/verifyToken')

const router = require('express').Router()

router.get('/', allProducts)
router.get('/medicines', medicines)
router.get('/healthcare',healthcare)
router.get('/pharmaceutical',pharmaceutical)
router.post('/newProduct', verifyToken, newProduct)
router.post('/addProduct', addProduct)
router.post('/:id', product)

module.exports = router

