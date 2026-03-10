const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getOne);
router.post('/', contactsController.create);
router.put('/:id', contactsController.update);
router.delete('/:id', contactsController.delete);

module.exports = router;
