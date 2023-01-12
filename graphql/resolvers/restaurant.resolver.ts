import { AuthenticationError, UserInputError } from 'apollo-server';
import { format } from 'date-fns';
import Restaurant from '../../models/Restaurant';
import User from '../../models/User';
import { Resolvers } from '../../types';

import { validateCreateRestaurantInput } from '../../util/validators/validatorRestaurant';

export const restaurantResolver : Resolvers = {
  Query: {
    async getRestaurants() {
      const restaurants = await Restaurant.find().populate('admin');
      if (restaurants) {
        return restaurants;
      }  
        throw new Error('restaurant not found');
      },
      
      async getRestaurant(_, { restaurantId }, context) {
        const restaurant = await Restaurant.findById(restaurantId).populate('admin');
        if (restaurant) { 
          if(restaurant.admin.id === context.userLogged.id){
            return restaurant;
          }
          throw new AuthenticationError('Action not allowed');
        }
        throw new Error('restaurant not found');
      },
  },   
  Mutation: {
    async createRestaurant(_, {
      createRestaurantInput:
      {
        name,
      },
    }, context) {
      const date = Date.now();
      const { valid, errors } = validateCreateRestaurantInput(name);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      console.log(`foo`, context.userLogged)
 
      const newRestaurant = new Restaurant(
        {
          name,
          admin: context.userLogged.id,
          turnoversRestaurantYear: {
            createdAt: format(date, 'yyyy'),
            totalSales: 0,
            turnoverYear: 0,
          },
        },
      );
      const userRestaurant = await User.findById(newRestaurant.admin);
      if(userRestaurant){
        userRestaurant.restaurants.push(newRestaurant.id);
        userRestaurant.save();
      }

      const restaurant = await newRestaurant.save();

      return restaurant.populate(['admin']);
    },
    async updateRestaurant(_, { restaurantId, createRestaurantInput:
        {
          name,
        },
      }, context) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (restaurant) {
          if(restaurant.admin.toString() === context.userLogged.id){
            const newRestaurant = await Restaurant.findByIdAndUpdate(
              restaurantId,
              {
                name,
              },
              { new: true },
              );
              await newRestaurant?.save();
              return restaurant;
            }
            throw new AuthenticationError('Action not allowed');
          }
        throw new UserInputError('Restaurant not found');
      },

      async deleteRestaurant(_, { restaurantId }, context) {
        const restaurant = await Restaurant.findById(restaurantId);
        if(restaurant){
          
          if (restaurant.admin.toString() === context.userLogged.id) {
            const deleteRestaurantUser = await User.findById(context.userLogged.id);
            const idRestaurant:any = restaurantId
            const restaurantToRemove = deleteRestaurantUser?.restaurants.indexOf(idRestaurant);
            if(restaurantToRemove) { 

              deleteRestaurantUser?.restaurants.splice(restaurantToRemove, 1);
              deleteRestaurantUser?.save();
            }
            
            await restaurant.delete();
            return restaurant
          }
          
          throw new AuthenticationError('Action not allowed');
        }
        else{
          throw new UserInputError('Restaurant not found');
        }
      },
  }}
   