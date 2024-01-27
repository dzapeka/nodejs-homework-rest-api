const express = require('express');

const router = express.Router();

const contactsRouter = require('./contacts');

const authMiddleware = require('../middlewares/auth');
router.use('/contacts', authMiddleware, contactsRouter);

module.exports = router;
