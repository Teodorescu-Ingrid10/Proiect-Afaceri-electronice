const User = require('./User');
const Product = require('./Product');
const Wishlist = require('./Wishlist');

// User.belongsToMany(Product, { through: Wishlist });
// Product.belongsToMany(User, { through: Wishlist });

Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {User, Product, Wishlist};