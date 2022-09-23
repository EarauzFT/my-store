const express = require('express')
const cors = require('cors');
const routerApi = require('./routes')
const { checkApiKey } = require('./middlewares/auth.handler')

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = 3000;

app.use(express.json()); //Middleware para recibir data de tipo JSON

const whitelist = ['http:localhost:8080'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'))
    }
  }
}
app.use(cors(options));

require('./utils/auth')

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
})

app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Hola soy una nueva ruta');
})

routerApi(app);

//Se le indica que haga uso de los middlewares importados
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Running in port', port)
})
