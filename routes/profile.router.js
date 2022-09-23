const express = require('express')
const passport = require('passport');
const OrderService = require('../services/product.service');

const router = express.Router();
const service = new OrderService();

router.get('/my-orders',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const products = await service.findByuser(req.user.sub);
      res.status(200).send(products);
    } catch (error) {

    }

  })

module.exports = router;
