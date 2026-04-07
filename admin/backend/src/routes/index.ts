import express from 'express';
import authRoutes from './authRoutes';
import evidenceRoutes from './evidenceRoutes';
import accessRoutes from './accessRoutes';
import adminRoutes from './adminRoutes';
import contactsRoutes from './contactsRoutes';
import alertsRoutes from './alertsRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/access', accessRoutes);
router.use('/admin', adminRoutes);
router.use('/contacts', contactsRoutes);
router.use('/alerts', alertsRoutes);

export default router;

