const nedb = require('nedb-promise');
menuDb = new nedb({ filename: './databases/menu.db', autoload: true });

async function getAllMenuItems() {
  return await menuDb.find({});
}

async function findMenuItemById(id) {
  return await menuDb.findOne({ _id: id });
}

async function saveToMenu(menuItem) {
  menuItem.createdAt = new Date();
  console.log(menuItem);
  return await menuDb.insert(menuItem);
}

async function findMenuItemByTitle(title) {
  return await menuDb.findOne({ title });
}

async function deleteFromMenu(id) {
  return await menuDb.remove({ _id: id });
}

async function modifyMenuItem(id, updatedMenuItem) {
  updatedMenuItem.modifiedAt = new Date();
  console.log(updatedMenuItem);
  return await menuDb.update({ _id: id }, { $set: updatedMenuItem });
}

module.exports = {
  getAllMenuItems,
  findMenuItemById,
  findMenuItemByTitle,
  saveToMenu,
  modifyMenuItem,
  deleteFromMenu,
};
