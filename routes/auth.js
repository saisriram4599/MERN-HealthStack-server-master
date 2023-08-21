const {register, login, newPassword, adminLogin} = require('../controllers/authController')
const { cacheUserLogin } = require('../middlewares/cacheMiddleware')

const router = require('express').Router()


router.post('/register',register)
router.post('/login', cacheUserLogin, login)
router.post('/newPassword',newPassword)
router.post('/adminLogin',adminLogin)

module.exports = router