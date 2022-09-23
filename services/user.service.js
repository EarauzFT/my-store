const faker = require('faker');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');


class UserService {
  constructor() {
    this.users = [];
    this.generate();
  }

  async generate() {
    this.users.push({
      id: faker.datatype.uuid(),
      email: 'Gina_Corkery42@example.org',
      password: await bcrypt.hash('123456', 10),
      role: "admin",
      recoveryToken: null,
    })
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = {
      id: faker.datatype.uuid(),
      ...data,
      password: hash
    }
    this.users.push(newUser);
    delete newUser.password;
    return newUser;
  }

  async find() {
    console.log(this.users)
    return this.users;
  }

  async findByEmail(email) {
    const user = this.users.find(item => item.email === email);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async findOne(id) {
    const user = this.users.find(item => item.id === id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound('user not Found')
    }
    const user = this.users[index];
    this.users[index] = {
      ...user, //Le indico que quiero conservar todos los datos
      ...changes  // Excepto los cambios
    };
    return this.users[index];
  }

  async delete(id) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound('user not Found')
    }
    this.users.splice(index, 1);
    return { id };
  }
}

module.exports = UserService;
