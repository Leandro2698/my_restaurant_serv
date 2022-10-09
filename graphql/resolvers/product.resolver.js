const { UserInputError } = require('apollo-server');
const { AuthenticationError } = require('apollo-server');
const { format } = require('date-fns');
const Restaurant = require('../../models/Restaurant');
const checkAuth = require('../../util/check-auth');
const turnoversProduct = require('../../util/turnoversProduct');
const turnoversRestaurant = require('../../util/turnoversRestaurant');

module.exports = {
  Mutation: {
    async createProduct(_, {
      restaurantId, createProductInput:
      {
        name,
        unitSalePrice,
        category,
      },
    }, context) {
      // eslint-disable-next-line
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        restaurant.products.unshift({
          name,
          createdAt: new Date(),
          unitSalePrice,
          unitProductSold: 0,
          turnoversProduct: {
            createdAt: new Date(),
            turnoverYear: 0,
          },
          category,
          status: 'draft',
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
        category,
        status,
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
          myProduct.category = category;
          myProduct.status = status;
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
        const thisYear = new Date();
        const foundSale = restaurant.sales.some((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy') && e.productId === productId);
        if (restaurant.admin.toString() === user.id) {
          const saleProduct = restaurant.sales.find((e) => e.productId === productId);
          if (!foundSale) {
            restaurant.sales.unshift({
              productId,
              createdAt: new Date(),
              unitProductSold: +unitProductSold,
            });
          } else {
            saleProduct.unitProductSold += unitProductSold;
          }
          turnoversProduct(restaurant, productId);
          turnoversRestaurant(restaurant);
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
