const express = require('express');
const { login, register, listUsers } = require("../controllers/authController");
const auth = require("../middleware/auth");


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, listUsers);

module.exports = router;