const express = require('express');
const { place_order, charges } = require('../services/place_order');
const { make_payment } = require('../services/payment');
const router = express.Router();

router.route("/place_order").post(place_order)
router.route("/charges").get(charges)
router.route('/make_payment').post(make_payment)

module.exports = router