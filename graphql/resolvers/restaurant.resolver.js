const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getRestaurants(){
      try {
        const restaurant = await Restaurant.find().sort({ createdAt: -1 }).populate(['admin']);
        return restaurant;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getRestaurant(_, { restaurantId }) {
      try {
        const restaurant = await Restaurant.findById(restaurantId).populate(['admin']);
        if (restaurant) {
          return restaurant;
        } else {
          throw new Error('restaurant not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
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
        // employees,
        // products,
        // turnovers_years 
      }
    }, context ){
      const user = checkAuth(context);
      console.log(`userCheck`, user)

      const newRestaurant = new Restaurant(
      {
        name,
        description,
        address,
        city,
        country,
        status,
        admin: user.id,
        create_at: new Date().toLocaleDateString(),
      }
      );
      let userRestaurant = await User.findById(newRestaurant.admin)
      userRestaurant.restaurants.push(newRestaurant.id)
      userRestaurant.save()
      
      const restaurant = await newRestaurant.save();

      return restaurant.populate(['admin'])
    }
  }
}