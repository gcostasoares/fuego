const express = require('express');
const multer  = require('multer');
const path    = require('path');
const ctr     = require('./adminDoctorsController');

const router = express.Router();

// Multer setup: save uploads to /public/images/Doctors
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../../public/images/Doctors')),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.get('/',       ctr.getDoctors);
router.get('/:id',    ctr.getDoctorById);
router.post('/',      upload.single('image'), ctr.createDoctor);
router.put('/:id',    upload.single('image'), ctr.updateDoctor);
router.delete('/:id', ctr.deleteDoctor);

module.exports = router;
