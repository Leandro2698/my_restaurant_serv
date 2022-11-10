const { UserInputError } = require('apollo-server');
const { AuthenticationError } = require('apollo-server');
const { format } = require('date-fns');
const Restaurant = require('../../models/Restaurant');
const checkAuth = require('../../util/check-auth');
const turnoversYearRestaurant = require('../../util/turnoversYearRestaurant');
const turnoverYearProduct = require('../../util/turnoverYearProduct');

module.exports = {
  Query: {
    async getProduct(_, { restaurantId, productId }, context) {
      const restaurant = await Restaurant.findById(restaurantId);
      const user = checkAuth(context);
      if (restaurant) {
        if (restaurant.admin.toString() === user.id) {
          const productIndex = restaurant.products.findIndex((product) => product.id === productId);
          const myProduct = Object.values(restaurant.products)[productIndex];
          return myProduct;
        }
        throw new AuthenticationError('Action not allowed');
      }
      throw new Error('product not found');
    },
    async getProducts(_, { restaurantId }, context) {
      const restaurant = await Restaurant.findById(restaurantId);
      const user = checkAuth(context);
      if (restaurant) {
        if (restaurant.admin.toString() === user.id) {
          const { products } = restaurant;
          return products;
        }
        throw new AuthenticationError('Action not allowed');
      }
      throw new Error('product not found');
    },
  },
  Mutation: {
    async createProduct(_, {
      restaurantId, createProductInput:
      {
        name,
        unitSalePrice,
        category,
      },
    }, context) {
      const user = checkAuth(context);
      const date = new Date();

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        if (restaurant.admin.toString() === user.id) {
          restaurant.products.unshift({
            name,
            createdAt: new Date(),
            unitSalePrice,
            turnoversProductTest: {
              income: 0,
              month: format(date, 'MMMM'),
              year: format(date, 'yyyy'),
              sales: 0,
            },
            turnoversProductYear: {
              createdAt: format(date, 'yyyy'),
              turnoverYear: 0,
              totalSales: 0,
            },
            category,
            status: 'draft',
          });
          await restaurant.save();
          return restaurant;
        }
        throw new AuthenticationError('Action not allowed');
      }
      throw new UserInputError('Restaurant not found');
    },

    async updateProduct(_, {
      restaurantId, productId, updateProductInput:
      {
        name,
        // unitSalePrice,
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
          // myProduct.unitSalePrice = unitSalePrice;
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
        const product = restaurant.products.find((e) => e.id === productId);
        const foundTurnoversProductMonth = product.turnoversProductMonth.some((e) => e.month === format(thisYear, 'MMMM') && e.year === format(thisYear, 'yyyy'));

        if (restaurant.admin.toString() === user.id) {
          const turnoverMonth = product.turnoversProductMonth.find((e) => e.month === format(thisYear, 'MMMM') && e.year === format(thisYear, 'yyyy'));
          const priceProduct = product.unitSalePrice;

          if (!foundTurnoversProductMonth) {
            product.turnoversProductMonth.unshift({
              sales: +unitProductSold,
              income: unitProductSold * priceProduct,
              month: format(thisYear, 'MMMM'),
              year: format(thisYear, 'yyyy'),
            });
          } else {
            turnoverMonth.sales += unitProductSold;
            turnoverMonth.income = turnoverMonth.sales * priceProduct;
          }

          turnoverYearProduct(restaurant, product);
          turnoversYearRestaurant(restaurant);
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
        if (restaurant.admin.toString() === user.id) {
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
