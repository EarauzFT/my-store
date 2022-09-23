const express = require('express')
const faker = require('faker')

const router = express.Router();

router.get('/', (req, res) => {
  const users = [];
  const { size } = req.query;
  const limit = size || 10

  for (let i = 0; i < limit; i++) {
    users.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    })
  }
  res.send(users);
})

module.exports = router;
