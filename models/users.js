const nedb = require('nedb-promise');
const bcrypt = require('bcrypt');
usersDb = new nedb({ filename: './databases/users.db', autoload: true });

async function getAllUsers() {
  return await usersDb.find({});
}

async function createUser(user) {
  user.password = await bcrypt.hash(user.password, 10);
  return await usersDb.insert(user);
}

async function findUserById(userId) {
  return await usersDb.findOne({ userId });
}

module.exports = { getAllUsers, createUser, findUserById };
