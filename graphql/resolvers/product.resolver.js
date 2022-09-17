const { UserInputError } = require('apollo-server');
const { AuthenticationError } = require('apollo-server');
const Restaurant = require('../../models/Restaurant');
const checkAuth = require('../../util/check-auth');
const turnoverProducts = require('../../util/turnoverProducts');
const turnoverRestaurant = require('../../util/turnoverRestaurant');

module.exports = {
  Mutation: {
    async createProduct(_, {
      restaurantId, createProductInput:
      {
        name,
        unitSalePrice,
      },
    }, context) {
      // eslint-disable-next-line
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);

      if (restaurant) {
        restaurant.products.unshift({
          name,
          year: new Date().getFullYear(),
          unitSalePrice,
          unitProductSold: 0,
        });
        await restaurant.save();
        return restaurant;
      }
      throw new UserInputError('Restaurant not found');
    },

    async updateProduct(_, {
      restaurantId, productId, updateProductInput:
      {
        name,
        unitSalePrice,
      },
    }, context) {
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        const productIndex = restaurant.products.findIndex((product) => product.id === productId);
        const myProduct = Object.values(restaurant.products)[productIndex];
        if (restaurant.admin.toString() === user.id) {
          myProduct.name = name;
          myProduct.unitSalePrice = unitSalePrice;
          await restaurant.save();
          return restaurant;
        }
        throw new AuthenticationError('Action not allowed');
      }
      throw new UserInputError('Restaurant not found');
    },

    async soldProduct(_, {
      restaurantId, productId, soldProductInput:
      {
        unitProductSold,
      },
    }, context) {
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        const productIndex = restaurant.products.findIndex((product) => product.id === productId);
        const myProduct = Object.values(restaurant.products)[productIndex];
        if (restaurant.admin.toString() === user.id) {
          myProduct.unitProductSold += unitProductSold;
          turnoverProducts(restaurant);
          turnoverRestaurant(restaurant);
          await restaurant.save();
          return restaurant;
        }
        throw new AuthenticationError('Action not allowed');
      }
      throw new UserInputError('Restaurant not found');
    },

    async deleteProduct(_, { restaurantId, productId }, context) {
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);

      if (restaurant) {
        const productIndex = restaurant.products.findIndex((product) => product.id === productId);
        if (restaurant.admin === user.id) {
          restaurant.products.splice(productIndex, 1);
          await restaurant.save();
          return restaurant;
        }
        throw new AuthenticationError('Action not allowed');
      } else {
        throw new UserInputError('Restaurant not found');
      }
    },
  },
};
