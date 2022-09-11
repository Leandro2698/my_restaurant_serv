const { mergeTypeDefs } = require('@graphql-tools/merge');
const userTypeDefs = require('./user.gql')
const restaurantTypeDefs = require('./restaurant.gql')

module.exports = mergeTypeDefs([userTypeDefs,restaurantTypeDefs]); 