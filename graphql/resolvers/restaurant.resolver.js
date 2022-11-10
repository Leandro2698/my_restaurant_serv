const { AuthenticationError } = require('apollo-server');
const { format } = require('date-fns');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getRestaurants() {
      try {
        const restaurants = await Restaurant.find().populate('admin');
        return restaurants;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getRestaurant(_, { restaurantId: id }) {
      const restaurant = await Restaurant.findById(id).populate('admin');
      if (restaurant) {
        return restaurant;
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
      const user = checkAuth(context);
      const date = new Date();
      const newRestaurant = new Restaurant(
        {
          name,
          admin: user.id,
          turnoversRestaurantYear: {
            createdAt: format(date, 'yyyy'),
            totalSales: 0,
            turnoverYear: 0,
          },
        },
      );
      const userRestaurant = await User.findById(newRestaurant.admin);
      userRestaurant.restaurants.push(newRestaurant.id);
      userRestaurant.save();

      const restaurant = await newRestaurant.save();

      return restaurant.populate(['admin']);
    },

    async deleteRestaurant(_, { restaurantId }, context) {
      const user = checkAuth(context);
      try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (restaurant.admin.toString() === user.id) {
          const deleteRestaurantUser = await User.findById(user.id);

          const restaurantToRemove = deleteRestaurantUser.restaurants.indexOf(restaurantId);
          deleteRestaurantUser.restaurants.splice(restaurantToRemove, 1);
          deleteRestaurantUser.save();

          await restaurant.delete();
          return `${restaurant} deleted succesfull`;
        }

        throw new AuthenticationError('Action not allowed');
      } catch (err) {
        throw new Error(err);
      }
    },

    async updateRestaurant(_, {
      restaurantId, createRestaurantInput:
      {
        name,
      },
    }, context) {
      const user = checkAuth(context);
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant.admin.toString() === user.id) {
        const updateRestaurant = await Restaurant.findByIdAndUpdate(
          restaurantId,
          {
            name,
          },
          { new: true },
        );

        updateRestaurant.save();
        return updateRestaurant;
      }
      throw new AuthenticationError('Action not allowed');
    },
  },
};
