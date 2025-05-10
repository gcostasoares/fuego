// backend/admin/Carousel/adminCarouselRoutes.js
const express     = require("express");
const multer      = require("multer");
const path        = require("path");
const { v4: uuidv4 } = require("uuid");              // ← add this
const router      = express.Router();
const controllers = require("./adminCarouselController");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Carousel")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))  // now uuidv4 is defined
});
const upload = multer({ storage });

router
  .get("/",            controllers.listCarousel)
  .get("/:id",         controllers.getCarousel)
  .post("/", upload.single("image"),    controllers.createCarousel)
  .put("/:id", upload.single("image"), controllers.updateCarousel)
  .delete("/:id",      controllers.deleteCarousel);

module.exports = router;
