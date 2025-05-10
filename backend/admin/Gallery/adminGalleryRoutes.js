// backend/admin/Gallery/adminGalleryRoutes.js
const express     = require("express");
const controllers = require("./adminGalleryController");
const router      = express.Router();

// Gallery metadata
router.get(   "/",    controllers.listGallery);
router.get(   "/:id", controllers.getGallery);
router.post(  "/",    controllers.createGallery);
router.put(   "/:id", controllers.updateGallery);
router.delete("/:id", controllers.deleteGallery);

// Grid‐slot endpoints
router.get(   "/:id/grid/products",          controllers.listGrid);
router.post(  "/:id/grid/products",          controllers.addGrid);
router.delete("/:id/grid/products/:productId", controllers.removeGrid);
router.put(   "/:id/grid/products/order",    controllers.orderGrid);

// Slide‐slot endpoints
router.get(   "/:id/slide/products",          controllers.listSlide);
router.post(  "/:id/slide/products",          controllers.addSlide);
router.delete("/:id/slide/products/:productId", controllers.removeSlide);
router.put(   "/:id/slide/products/order",    controllers.orderSlide);

module.exports = router;
