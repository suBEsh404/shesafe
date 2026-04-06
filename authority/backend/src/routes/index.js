const express = require('express');
const authRoutes = require('./authRoutes');
const evidenceRoutes = require('./evidenceRoutes');
const accessRoutes = require('./accessRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/access', accessRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
