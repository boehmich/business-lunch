const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller')


router.get('/isAdmin/:id', UserController.isUserAdmin)

router.post('/login', UserController.userLogin);

router.post('/signup', UserController.userSignup);


module.exports = router;