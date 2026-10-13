const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

router.post('/', enquiryController.createEnquiry);
router.get('/', enquiryController.getEnquiries);
router.post('/:id/approve', enquiryController.approveEnquiry);
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
