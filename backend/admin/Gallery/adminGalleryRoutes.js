/* admin/Gallery/adminGalleryRoutes.js
   ────────────────────────────────────────────────────────────────── */
const express = require("express");
const ctrl    = require("./adminGalleryController");

const router = express.Router();

/* ─── main CRUD ─────────────────────────────────────────────── */
router.get(   "/",      ctrl.listGallery);      // list all
router.get(   "/:id",   ctrl.getGallery);       // get one
router.post(  "/",      ctrl.createGallery);    // create
router.put(   "/:id",   ctrl.updateGallery);    // update
router.delete("/:id",   ctrl.deleteGallery);    // delete

/* ─── GRID helpers ──────────────────────────────────────────── */
router.get(   "/:id/grid/products",               ctrl.listGrid);
router.post(  "/:id/grid/products",               ctrl.addGrid);
router.delete("/:id/grid/products/:productId",    ctrl.removeGrid);
router.put(   "/:id/grid/products/order",         ctrl.orderGrid);

/* ─── SLIDE helpers ─────────────────────────────────────────── */
router.get(   "/:id/slide/products",              ctrl.listSlide);
router.post(  "/:id/slide/products",              ctrl.addSlide);
router.delete("/:id/slide/products/:productId",   ctrl.removeSlide);
router.put(   "/:id/slide/products/order",        ctrl.orderSlide);

module.exports = router;
