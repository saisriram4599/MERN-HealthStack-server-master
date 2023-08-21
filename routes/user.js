const { updateProfile, uploadProfilePic, profileDetails, user, userList } = require('../controllers/userController');
// const { upload } = require('../middlewares/multerMiddleware');

const router = require('express').Router();

router.get("/", userList);
router.post('/updateprofile', updateProfile);
router.post('/profilepic', uploadProfilePic);
router.post('/profiledetails',profileDetails)
router.get('/:id', user)

module.exports = router;