const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user.resolver');
const restaurantResolver = require('./restaurant.resolver');
const employeeResolver = require('./employee.resolver');

module.exports = mergeResolvers([userResolver, restaurantResolver, employeeResolver]);
