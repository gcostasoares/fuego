// backend/admin/PartnerLogos/adminPartnerLogosRoutes.js
const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrls   = require("./adminPartnerLogosController");

const router = express.Router();

/* Multer-Storage nur für echte Uploads */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/PartnerLogos")),
  filename: (_req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* „Vielleicht“-Upload – nur wenn Content-Type multipart ist */
function maybeUpload(req, res, next) {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  return ct.startsWith("multipart/") ? upload.single("image")(req, res, next)
                                     : next();
}

router
  .get("/",      ctrls.listPartnerLogos)
  .get("/:id",   ctrls.getPartnerLogo)
  .post("/",     upload.single("image"), ctrls.createPartnerLogo)
  .put("/:id",   maybeUpload,            ctrls.updatePartnerLogo)
  .delete("/:id", ctrls.deletePartnerLogo);

module.exports = router;
