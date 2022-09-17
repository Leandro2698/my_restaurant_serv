const { AuthenticationError } = require('apollo-server');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');
const turnoverRestaurant = require('../../util/turnoverRestaurant');

module.exports = {
  Query: {
    async getRestaurants() {
      try {
        const restaurant = await Restaurant.find().populate('admin');
        return restaurant;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getRestaurant(_, { restaurantId }) {
      const restaurant = await Restaurant.findById(restaurantId).populate('admin');
      // console.log('restarestaurant.admin', restaurant.admin.firstname);
      if (restaurant) {
        turnoverRestaurant(restaurant);
        await restaurant.save();
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
        description,
        address,
        city,
        country,
        status,
      },
    }, context) {
      const user = checkAuth(context);
      const newRestaurant = new Restaurant(
        {
          name,
          description,
          address,
          city,
          country,
          status,
          admin: user.id,
          create_at: new Date().getFullYear(),
          turnoversYears: {
            year: new Date().getFullYear(),
            total: 0,
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
        description,
        address,
        city,
        country,
      },
    }, context) {
      const user = checkAuth(context);
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant.admin.toString() === user.id) {
        const updateRestaurant = await Restaurant.findByIdAndUpdate(
          restaurantId,
          {
            name, description, address, city, country, status: 'progress',
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
