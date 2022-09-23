const UserService = require('./user.service');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

const Service = new UserService();
class AuthService {

  async getUser(email, password) {
    const user = await Service.findByEmail(email);
    if (!user) {
      throw boom.notFound('user not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.password;
    return user;
  }
  singToken(user) {
    const payload = { // Identificador
      sub: user.id,
      role: user.role
    }
    console.log(process.env.API_KEY)
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return { user, token };
  }

  async sendRecovery(email) {
    const user = await Service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15min' });
    const link = `http://myfrontend.com/recovery?token=${token}`
    //se debe guardar el token en la db ex:
    const rspta = await Service.update(user.id, { recoveryToken: token });
    console.log('rspta', rspta)
    const mail = {
      from: 'alaina46@ethereal.email', // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para recuperar contrasenna", // Subject line
      html: `<b>Ingresa a este link => ${link}</b>`, // html body
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await Service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'Password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'alaina46@ethereal.email',
        pass: 'J2qqCm7xqUCf9bqUKp'
      },
    });

    // send mail with defined transport object
    await transporter.sendMail(infoMail);
    return { message: 'Mail sent' };
  }
}

module.exports = AuthService;
