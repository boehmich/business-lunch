const express = require('express');

const checkAuthentication = require('../middleware/check-authentication.middleware');
const extractFile = require('../middleware/file.middleware');

const router = express.Router();
const InvoiceController = require('../controllers/invoice.controller');

router.post('',
    checkAuthentication,
    extractFile,
    InvoiceController.createInvoice);

router.get('', InvoiceController.getInvoices);

router.get('/:id', InvoiceController.getInvoice);

router.put('/:id',
    checkAuthentication,
    extractFile,
    InvoiceController.updateInvoice);

router.delete('/:id', InvoiceController.deleteInvoice);

module.exports = router;