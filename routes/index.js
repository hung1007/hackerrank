const authController = require('../controllers/auth.js')
const router = require("express").Router();
router.post('/login', authController.login)
router.post('/validate', authController.validate)
module.exports = router;