import express from 'express';
import contactsController from '../controllers/contactsController';
import validate from '../middleware/validate';
import { authenticateRequired } from '../middleware/authMiddleware';
import {
  contactIdParamSchema,
  contactsListQuerySchema,
  createContactSchema,
  updateContactSchema
} from '../validators/contactsValidators';

const router = express.Router();

router.get('/', authenticateRequired, validate(contactsListQuerySchema, 'query'), contactsController.list);
router.post('/', authenticateRequired, validate(createContactSchema), contactsController.create);
router.patch('/:contactId', authenticateRequired, validate(contactIdParamSchema, 'params'), validate(updateContactSchema), contactsController.update);
router.delete('/:contactId', authenticateRequired, validate(contactIdParamSchema, 'params'), contactsController.remove);

export default router;
