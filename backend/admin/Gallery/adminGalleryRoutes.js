const express = require("express");
const ctrl    = require("./adminGalleryController");
const router  = express.Router();

/* CRUD */
router.get(   "/",    ctrl.listGallery);
router.get(   "/:id", ctrl.getGallery);
router.post(  "/",    ctrl.createGallery);
router.put(   "/:id", ctrl.updateGallery);
router.delete("/:id", ctrl.deleteGallery);

/* grid helpers */
router.get(   "/:id/grid/products",               ctrl.listGrid);
router.post(  "/:id/grid/products",               ctrl.addGrid);
router.delete("/:id/grid/products/:productId",    ctrl.removeGrid);
router.put(   "/:id/grid/products/order",         ctrl.orderGrid);

/* slide helpers */
router.get(   "/:id/slide/products",              ctrl.listSlide);
router.post(  "/:id/slide/products",              ctrl.addSlide);
router.delete("/:id/slide/products/:productId",   ctrl.removeSlide);
router.put(   "/:id/slide/products/order",        ctrl.orderSlide);

module.exports = router;
