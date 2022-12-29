// const { UserInputError } = require('apollo-server');
import { UserInputError } from 'apollo-server'
// const { AuthenticationError } = require('apollo-server');
import { AuthenticationError } from 'apollo-server'
import { format } from 'date-fns';
import Restaurant from '../../models/Restaurant'; 
import checkAuth from '../../util/check-auth';
import turnoversYearRestaurant from '../../util/turnoversYearRestaurant';
import turnoverYearProduct from '../../util/turnoverYearProduct';
import {Resolvers} from '../../types'

export const productResolver : Resolvers = {
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
      throw new Error('restaurant not found');
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
      const date = Date.now();
      console.log(`format(date, 'yyyy'),`, format(date, 'yyyy')) 

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        if (restaurant.admin.toString() === user.id) {
          restaurant.products.unshift({
            name,
            unitSalePrice,
            turnoversProductMonth: [{
              income: 0,
              month: format(date, 'MMMM'),
              year: format(date, 'yyyy'),
              day: format(date, 'd'), 
              sales: 0,
            }],
            turnoversProductYear: [{
              createdAt: format(date, 'yyyy'),
              turnoverYear: 0,
              totalSales: 0,
            }],
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
      console.log(`user`, user)

      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        const thisYear = Date.now();
        const product = restaurant.products.find((e) => e.id === productId);
        const foundTurnoversProductDay = product?.turnoversProductMonth.some((e) => e.month === format(thisYear, 'MMMM') && e.year === format(thisYear, 'yyyy') && e.day === format(thisYear, 'd'));

        if (restaurant.admin.toString() === user.id) {
          if(product){

            const turnoverDay = product.turnoversProductMonth.find((e) => e.month === format(thisYear, 'MMMM') && e.year === format(thisYear, 'yyyy') && e.day === format(thisYear, 'd'));
            const priceProduct = product?.unitSalePrice;
            
            if (!foundTurnoversProductDay) {
              console.log(`thisthisYear`,thisYear)
              product.turnoversProductMonth.unshift({ 
                sales: +unitProductSold,
                income: unitProductSold * priceProduct,
                month: format(thisYear, 'MMMM'),
                year: format(thisYear, 'yyyy'),
                day: format(thisYear, 'd'),
              });
            } else if(product && turnoverDay ) {
              turnoverDay.sales += unitProductSold;
              turnoverDay.income = turnoverDay.sales * priceProduct;
            }
            
            turnoverYearProduct(restaurant, product);
            turnoversYearRestaurant(restaurant);
            await restaurant.save();
            
            return restaurant;
          }
          throw new AuthenticationError('Action not allowed');
        }
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
}
