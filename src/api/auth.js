const express = require('express');
const { register, login, getMe, updateUserRole, getUsers, updatePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, requireOwner } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, getMe);

router.get('/users', protect, requireOwner, getUsers);
router.put('/users/:userId/role', protect, requireOwner, updateUserRole);

router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;