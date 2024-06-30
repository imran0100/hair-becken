

const express = require('express');
const router = express.Router();
const hairTestValidation = require("../validations/hairTest.validation.js")
const validate = require("../helpers/validate.js");
const { createHairTestForUser, updateHairTestStep, getHairTestDetail } = require('../controllers/hairTest.controller.js');
const { verifyJwt } = require('../middlewares/auth.middleware.js');
const { upload } = require('../utils/upload.utils.js');
const { uploadImage } = require('../controllers/hairTest.controller.js');

// Route for uploading images
router.post('/upload-image', upload.single('image'), uploadImage);
router.get('/gethairtest-detail', getHairTestDetail)

router.post("/create", verifyJwt, createHairTestForUser)


module.exports = router;
