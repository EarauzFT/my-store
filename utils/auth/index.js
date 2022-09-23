const passport = require('passport');

//Se declara la estrategia de autenticacion a utilizar
const LocalStrategy = require('./strategies/local.strategy')
const JwtStrategy = require('./strategies/jwt.strategy')

passport.use(LocalStrategy);
passport.use(JwtStrategy);
