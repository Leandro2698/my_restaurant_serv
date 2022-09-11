const { UserInputError } = require('apollo-server');
const { AuthenticationError } = require('apollo-server');
const Restaurant = require('../../models/Restaurant');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Mutation: {
    async createEmployee(_, {
      restaurantId, createEmployeeInput:
      {
        firstname,
        lastname,
        role,
        salary,
      },
    }, context) {
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);

      if (restaurant) {
        restaurant.employees.unshift({
          firstname,
          lastname,
          role,
          salary,
          admin: user.id,
        });
        await restaurant.save();
        return restaurant;
      }
      throw new UserInputError('Restaurant not found');
    },
    async deleteEmployee(_, { restaurantId, employeeId }, context) {
      const user = checkAuth(context);

      const restaurant = await Restaurant.findById(restaurantId);

      if (restaurant) {
        const employeeIndex = restaurant.employees.findIndex((employee) => employee.id === employeeId);
        if (restaurant.employees[employeeIndex].admin === user.id) {
          restaurant.employees.splice(employeeIndex, 1);
          // console.log('foo', restaurant.employees[employeeIndex].admin);
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
