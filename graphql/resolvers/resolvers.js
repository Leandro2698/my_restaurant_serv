const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user.resolver');
const restaurantResolver = require('./restaurant.resolver');
const employeeResolver = require('./employee.resolver');
const productResolver = require('./product.resolver');
// const turnoverResolver = require('./turnover.resolver');

module.exports = mergeResolvers([userResolver, restaurantResolver, employeeResolver, productResolver]);
