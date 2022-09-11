const { AuthenticationError } = require('apollo-server');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getRestaurants(){
      try {
        // the sort is for have the last restaurant
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
    },

    async deleteRestaurant(_,{restaurantId}, context){
      const user = checkAuth(context);
      try {
        const restaurant = await Restaurant.findById(restaurantId)      
        if(restaurant.admin.includes(user.id)){

          const deleteRestaurantUser = await User.findById(user.id)

          const restaurantToRemove =  deleteRestaurantUser.restaurants.indexOf(restaurantId)
          deleteRestaurantUser.restaurants.splice(restaurantToRemove,1)
          deleteRestaurantUser.save()
          
          await restaurant.delete();
          return `${restaurant} deleted succesfull`
          
        }
        else{
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }

    }
  }
}