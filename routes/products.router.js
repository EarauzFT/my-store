const express = require('express')
const passport = require('passport');

const ProductsService = require('./../services/product.service')
const validatorHandler = require('./../middlewares/validator.handler')
const { checkAdminRole, checkRoles } = require('./../middlewares/auth.handler')
const { createProductSchema, updateProductSchema, getProductSchema } = require('./../schemas/product.schema')

const router = express.Router();
const service = new ProductsService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller', 'customer'),
  async (req, res) => {
    const products = await service.find();
    res.status(200).send(products);
  })

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  })

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const newProduct = await service.create(body);
    res.status(200).json({
      message: 'created',
      data: newProduct
    })
  })

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const { id } = req.params
      const product = await service.update(id, body);
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }

  })

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.params
    const rta = await service.delete(id);
    res.status(200).json({
      message: 'deleted',
      rta
    })
  })

module.exports = router;
