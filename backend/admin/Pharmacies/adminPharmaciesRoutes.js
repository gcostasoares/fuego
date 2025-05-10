const express = require("express");
const router = express.Router();
const ctrl   = require("./adminPharmaciesController");
const auth   = require("../../adminAuthMiddleware");

router.use(auth);

router.get("/",    ctrl.getAllPharmacies);
router.post("/",   ctrl.createPharmacy);
router.put("/:id", ctrl.updatePharmacy);
router.delete("/:id", ctrl.deletePharmacy);

module.exports = router;
