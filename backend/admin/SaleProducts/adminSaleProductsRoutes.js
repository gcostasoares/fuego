const express = require("express");
const ctrl    = require("./adminSaleProductsController");
const router  = express.Router();

router
  .get(   "/",      ctrl.listSaleProducts)
  .get(   "/:id",   ctrl.getSaleProduct)
  .post(  "/",      ctrl.createSaleProduct)
  .put(   "/:id",   ctrl.updateSaleProduct)
  .delete("/:id",   ctrl.deleteSaleProduct);

module.exports = router;
