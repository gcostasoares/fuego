/* admin/AppContent/adminAppContentRoutes.js */
const express = require("express");
const ctrl    = require("./adminAppContentController");

const router = express.Router();

// no uploads needed – everything is text / HTML
router.get(   "/",     ctrl.getAllAppContent);
router.get(   "/:id",  ctrl.getAppContentById);
router.post(  "/",     ctrl.createAppContent);
router.put(   "/:id",  ctrl.updateAppContent);
router.delete("/:id",  ctrl.deleteAppContent);

module.exports = router;

